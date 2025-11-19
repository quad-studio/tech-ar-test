let camera, scene, renderer, controller;
let model = null;
let modelPlaced = false;

// Inicialização básica Three.js
scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera();
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// Botão AR do próprio Three.js
document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

// Carregar modelo
const loader = new THREE.GLTFLoader();
loader.load("machine.glb", glb => {
    model = glb.scene;
    model.scale.set(0.4, 0.4, 0.4);
    model.visible = false;
    scene.add(model);
});

// Hit test
let hitTestSource = null;
let hitTestSourceRequested = false;

// Controller do AR para detectar toque
controller = renderer.xr.getController(0);
controller.addEventListener('select', () => {
    modelPlaced = true;
});
scene.add(controller);

function animate(timestamp, frame) {
    renderer.setAnimationLoop(animate);

    if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (!hitTestSourceRequested) {
            session.requestReferenceSpace("viewer").then(refSpace => {
                session.requestHitTestSource({ space: refSpace }).then(source => {
                    hitTestSource = source;
                });
            });

            session.addEventListener("end", () => {
                hitTestSourceRequested = false;
                hitTestSource = null;
            });

            hitTestSourceRequested = true;
        }

        if (hitTestSource && !modelPlaced) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);
            if (hitTestResults.length) {
                const hit = hitTestResults[0];
                const pose = hit.getPose(referenceSpace);

                model.position.set(
                    pose.transform.position.x,
                    pose.transform.position.y,
                    pose.transform.position.z
                );

                model.visible = true;
            }
        }
    }

    renderer.render(scene, camera);
}

// UI Buttons ----------------------

document.querySelector("#btnFocus").onclick = () => {
    if (!model) return;
    model.scale.set(0.6, 0.6, 0.6);
};

document.querySelector("#btnReset").onclick = () => {
    if (!model) return;
    model.scale.set(0.4, 0.4, 0.4);
};

document.querySelector("#btnInfo").onclick = () => {
    document.querySelector("#infoPanel").style.display = "block";
};

document.querySelector("#btnCloseInfo").onclick = () => {
    document.querySelector("#infoPanel").style.display = "none";
};

animate();
