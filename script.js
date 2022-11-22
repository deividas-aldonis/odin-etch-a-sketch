const rangeValue = document.querySelector('.range-value');
const rangeInput = document.querySelector('.range-input');
const colorValue = document.querySelector('.color-value');
const colorInput = document.querySelector('.color-input');

const grid = document.querySelector('.grid');
const auto = document.querySelector('.auto');
const clear = document.querySelector('.clear');
const eraser = document.querySelector('.eraser');
const rainbow = document.querySelector('.rainbow');

const hexArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
let color = '#000';
let autoMode = false;
let eraserMode = false;
let rainbowMode = false;
let mouseDown = false;

const getRandomColor = () => {
    let randomColor = '#';

    for (let i = 0; i < 6; i += 1) {
        const random = Math.floor(Math.random() * hexArr.length);
        randomColor += hexArr[random];
    }

    return randomColor;
};

const draw = (e) => {
    let tempColor = '';

    if (eraserMode) {
        tempColor = '#fff';
    } else if (rainbowMode) {
        tempColor = getRandomColor();
    } else {
        tempColor = color;
    }

    if (e.type === 'mousedown') {
        e.target.style.backgroundColor = tempColor;
    }

    if (mouseDown || autoMode) {
        e.target.style.backgroundColor = tempColor;
    }
};

const createGrid = (gridSize = 1, blockSize = 600) => {
    grid.textContent = '';

    for (let i = 0; i < gridSize; i += 1) {
        const div = document.createElement('div');
        div.style.height = `${blockSize}px`;
        div.style.width = `${blockSize}px`;
        div.addEventListener('mouseenter', draw);
        div.addEventListener('mousedown', draw);
        grid.appendChild(div);
    }
};

rangeInput.addEventListener('input', (e) => {
    rangeValue.textContent = `Size: ${e.target.value}x${e.target.value}`;
});

rangeInput.addEventListener('change', (e) => {
    const range = e.target.valueAsNumber;
    const { width: gridWidth } = grid.getBoundingClientRect();
    const blockSize = gridWidth / range;
    const gridSize = range ** 2;
    createGrid(gridSize, blockSize);
});

colorInput.addEventListener('input', (e) => {
    colorValue.textContent = e.target.value;
    color = e.target.value;

    if (eraserMode) {
        eraserMode = false;
        eraser.textContent = 'Eraser: off';
    }
    if (rainbowMode) {
        rainbowMode = false;
        rainbow.textContent = 'Rainbow: off';
    }
});

auto.addEventListener('click', (e) => {
    if (autoMode) {
        e.target.textContent = 'Auto: off';
        autoMode = false;
    } else {
        e.target.textContent = 'Auto: on';
        autoMode = true;
    }
});

clear.addEventListener('click', () => {
    const blocks = [...grid.children];

    blocks.forEach((block) => {
        const gridBlock = block;
        gridBlock.style.backgroundColor = '#fff';
    });
});

eraser.addEventListener('click', (e) => {
    if (eraserMode) {
        e.target.textContent = 'Eraser: off';
        eraserMode = false;
    } else {
        e.target.textContent = 'Eraser: on';
        eraserMode = true;

        if (rainbowMode) {
            rainbowMode = false;
            rainbow.textContent = 'Rainbow: off';
        }
    }
});

rainbow.addEventListener('click', (e) => {
    if (rainbowMode) {
        e.target.textContent = 'Rainbow: off';
        rainbowMode = false;
    } else {
        e.target.textContent = 'Rainbow: on';
        rainbowMode = true;
    }
});

window.addEventListener('mousedown', (e) => {
    mouseDown = true;
});

window.addEventListener('mouseup', () => {
    mouseDown = false;
});

createGrid();
