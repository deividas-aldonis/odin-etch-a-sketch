const rangeValue = document.querySelector('.range-value');
const rangeInput = document.querySelector('.range-input');
const colorValue = document.querySelector('.color-value');
const colorInput = document.querySelector('.color-input');

const grid = document.querySelector('.grid');
const auto = document.querySelector('.auto');
const clear = document.querySelector('.clear');
const eraser = document.querySelector('.eraser');
const rainbow = document.querySelector('.rainbow');
const shade = document.querySelector('.shade');

const popup = document.querySelector('.popup');
const agree = document.querySelector('.agree');
const disagree = document.querySelector('.disagree');
const menu = document.querySelector('.menu');
const closeMenu = document.querySelector('.close-menu');
const openMenu = document.querySelector('.open-menu');

const hexArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
const shadesOfBlack = [
    '#D3D3D3',
    '#C0C0C0',
    '#B0B0B0',
    '#989898',
    '#787878',
    '#696969',
    '#505050',
    '#383838',
    '#282828',
    '#000000'
];
let color = '#000';
let autoMode = false;
let eraserMode = false;
let rainbowMode = false;
let shadeMode = false;
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
    } else if (shadeMode) {
        const { shadeIndex } = e.target.dataset;
        tempColor = shadesOfBlack[Number(shadeIndex)];
    } else {
        tempColor = color;
    }

    if (e.type === 'mousedown' || e.type === 'touchstart') {
        e.target.style.backgroundColor = tempColor;

        if (!shadeMode) {
            e.target.dataset.shadeIndex = 0;
        } else if (shadeMode) {
            const { shadeIndex } = e.target.dataset;
            const nextIndex = Number(shadeIndex) + 1;
            e.target.dataset.shadeIndex = nextIndex > 9 ? 9 : nextIndex;
        }
    } else if (mouseDown || autoMode) {
        e.target.style.backgroundColor = tempColor;

        if (eraserMode) {
            e.target.dataset.shadeIndex = 0;
        } else if (shadeMode) {
            const { shadeIndex } = e.target.dataset;
            const nextIndex = Number(shadeIndex) + 1;
            e.target.dataset.shadeIndex = nextIndex > 9 ? 9 : nextIndex;
        }
    }
};

const createGrid = (range = 1) => {
    grid.textContent = '';

    const { width: gridWidth } = grid.getBoundingClientRect();
    const blockSize = gridWidth / range;
    const gridSize = range ** 2;

    for (let i = 0; i < gridSize; i += 1) {
        const div = document.createElement('div');
        div.style.height = `${blockSize}px`;
        div.style.width = `${blockSize}px`;
        div.dataset.shadeIndex = 0;
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
    createGrid(range);
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
    if (shadeMode) {
        shadeMode = false;
        shade.textContent = 'Shade: off';
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
    popup.classList.remove('hide');
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
        if (shadeMode) {
            shadeMode = false;
            shade.textContent = 'Shade: off';
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

        if (eraserMode) {
            eraser.textContent = 'Eraser: off';
            eraserMode = false;
        }
        if (shadeMode) {
            shadeMode = false;
            shade.textContent = 'Shade: off';
        }
    }
});

shade.addEventListener('click', (e) => {
    if (shadeMode) {
        e.target.textContent = 'Shade: off';
        shadeMode = false;
    } else {
        e.target.textContent = 'Shade: on';
        shadeMode = true;

        if (eraserMode) {
            eraser.textContent = 'Eraser: off';
            eraserMode = false;
        }
        if (rainbowMode) {
            rainbowMode = false;
            rainbow.textContent = 'Rainbow: off';
        }
    }
});

agree.addEventListener('click', () => {
    const blocks = [...grid.children];
    blocks.forEach((block) => {
        const gridBlock = block;
        gridBlock.style.backgroundColor = '#fff';
        gridBlock.dataset.shadeIndex = 0;
    });

    popup.classList.add('hide');
});

disagree.addEventListener('click', () => {
    popup.classList.add('hide');
});

closeMenu.addEventListener('click', () => {
    menu.classList.add('hide');
});

openMenu.addEventListener('click', () => {
    menu.classList.remove('hide');
});

window.addEventListener('mousedown', (e) => {
    mouseDown = true;
});

window.addEventListener('mouseup', () => {
    mouseDown = false;
});

window.addEventListener('click', (e) => {
    if (popup.classList.contains('hide') || e.target.classList.contains('clear')) return;

    const popupClicked = e.target.closest('.popup');

    if (!popupClicked) {
        popup.classList.add('hide');
    }
});

window.addEventListener('resize', () => {
    const range = rangeInput.valueAsNumber;
    createGrid(range);
});

createGrid();
