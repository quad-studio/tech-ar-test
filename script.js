let model = null;
let defaultRotation = { x: 0, y: 0, z: 0 };
let defaultScale = { x: 0.4, y: 0.4, z: 0.4 };
let rotationY = 0;

// Aguardar modelo carregar
document.querySelector('#machine').addEventListener('model-loaded', e => {
    model = document.querySelector('#machine');
});

// BOTÕES DA INTERFACE
document.querySelector('#btnFocus').onclick = () => {
    if (!model) return;
    model.setAttribute('scale', "0.6 0.6 0.6");
    model.setAttribute('position', "0 0.1 0");
};

document.querySelector('#btnReset').onclick = () => {
    if (!model) return;
    model.setAttribute('rotation',
        `${defaultRotation.x} ${defaultRotation.y} ${defaultRotation.z}`);
    model.setAttribute('scale',
        `${defaultScale.x} ${defaultScale.y} ${defaultScale.z}`);
    model.setAttribute('position', "0 0 0");
};

document.querySelector('#btnInfo').onclick = () => {
    document.querySelector('#infoPanel').style.display = "block";
};
document.querySelector('#btnCloseInfo').onclick = () => {
    document.querySelector('#infoPanel').style.display = "none";
};

// HOTSPOT clicável
document.querySelector('#hotspot').addEventListener('click', () => {
    document.querySelector('#infoPanel').style.display = "block";
});

// ROTACIONAR arrastando dedo (igual sketchfab)
let isDragging = false;
let prevX = 0;

document.addEventListener('mousedown', e => {
    isDragging = true;
    prevX = e.clientX;
});
document.addEventListener('mouseup', () => isDragging = false);
document.addEventListener('mousemove', e => {
    if (!isDragging || !model) return;
    let delta = e.clientX - prevX;
    prevX = e.clientX;
    rotationY += delta * 0.4;
    model.setAttribute('rotation', `0 ${rotationY} 0`);
});
