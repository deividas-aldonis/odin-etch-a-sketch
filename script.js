const rangeValue = document.querySelector('.range-value');
const rangeInput = document.querySelector('.range-input');
const colorValue = document.querySelector('.color-value');
const colorInput = document.querySelector('.color-input');

const grid = document.querySelector('.grid');
const auto = document.querySelector('.auto');

let color = 'black';
let autoMode = false;
let mouseDown = false;

const draw = (e) => {
    if (mouseDown) {
        e.target.style.backgroundColor = color;
    } else if (autoMode) {
        e.target.style.backgroundColor = color;
    }
};

const createGrid = (gridSize = 1, blockSize = 600) => {
    grid.textContent = '';

    for (let i = 0; i < gridSize; i += 1) {
        const div = document.createElement('div');
        div.style.height = `${blockSize}px`;
        div.style.width = `${blockSize}px`;
        div.addEventListener('mouseenter', draw);
        div.addEventListener('mousedown', (e) => {
            e.target.style.backgroundColor = color;
        });
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
});

auto.addEventListener('click', (e) => {
    if (autoMode) {
        e.target.textContent = 'Auto: no';
        autoMode = false;
    } else {
        e.target.textContent = 'Auto: yes';
        autoMode = true;
    }
});

window.addEventListener('mousedown', (e) => {
    mouseDown = true;
});

window.addEventListener('mouseup', () => {
    mouseDown = false;
});

createGrid();
