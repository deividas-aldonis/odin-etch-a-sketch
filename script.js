const grid = document.querySelector('.grid');
const menu = document.querySelector('.menu');
const popup = document.querySelector('.popup');
const toast = document.querySelector('.toast');

const rangeValue = document.querySelector('.range-value');
const rangeInput = document.querySelector('.range-input');
const colorValue = document.querySelector('.color-value');
const colorInput = document.querySelector('.color-input');

const clearBtn = document.querySelector('.clear-btn');
const autoModeBtn = document.querySelector('.auto-mode-btn');
const eraserModeBtn = document.querySelector('.eraser-mode-btn');
const rainbowModeBtn = document.querySelector('.rainbow-mode-btn');
const shadeModeBtn = document.querySelector('.shade-mode-btn');
const gridModeBtn = document.querySelector('.grid-mode-btn');
const darkModeBtn = document.querySelector('.dark-mode-btn');

const agreeBtn = document.querySelector('.agree-btn');
const disagreeBtn = document.querySelector('.disagree-btn');
const closeMenuBtn = document.querySelector('.close-menu-btn');
const openMenuBtn = document.querySelector('.open-menu-btn');

const stateElements = {
    gridMode: document.querySelector('.grid-mode-state'),
    autoMode: document.querySelector('.auto-mode-state'),
    eraserMode: document.querySelector('.eraser-mode-state'),
    shadeMode: document.querySelector('.shade-mode-state'),
    rainbowMode: document.querySelector('.rainbow-mode-state'),
    darkMode: document.querySelector('.dark-mode-state')
};

const settings = {
    autoMode: false,
    eraserMode: false,
    rainbowMode: false,
    shadeMode: false,
    gridMode: false,
    darkMode: false,
    mouseDown: false,

    calculateGridSize() {
        const range = rangeInput.valueAsNumber;
        const { width: gridWidth } = grid.getBoundingClientRect();
        const blockSize = gridWidth / range;
        const gridSize = range ** 2;
        return { gridSize, blockSize };
    },
    turnOffMode(...modes) {
        modes.forEach((mode) => {
            this[mode] = false;
            stateElements[mode].textContent = 'off';
            stateElements[mode].parentElement.classList.remove('active');
        });
    },
    turnOnMode(...modes) {
        modes.forEach((mode) => {
            this[mode] = true;
            stateElements[mode].textContent = 'on';
            stateElements[mode].parentElement.classList.add('active');
        });
    }
};

const colors = {
    defaultColor: '#000000',
    colorInputColor: '#000000',
    eraserColor: '#ffffff',
    hexValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'],
    shadeValues: [
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
    ],

    getRandomColor() {
        let randomColor = '#';

        for (let i = 0; i < 6; i += 1) {
            const random = Math.floor(Math.random() * this.hexValues.length);
            randomColor += this.hexValues[random];
        }

        return randomColor;
    },
    getShadeColor(shadeIndex) {
        return this.shadeValues[+shadeIndex];
    },
    getColor(target) {
        const { eraserMode, rainbowMode, shadeMode } = settings;

        if (eraserMode) {
            return this.eraserColor;
        }
        if (rainbowMode) {
            return this.getRandomColor();
        }
        if (shadeMode) {
            return this.getShadeColor(target.dataset.shadeIndex);
        }

        return this.colorInputColor;
    }
};

const UI = {
    draw(e) {
        const { target } = e;
        const { autoMode, shadeMode, mouseDown } = settings;
        const color = colors.getColor(target);

        if (autoMode || mouseDown || e.type === 'mousedown') {
            target.style.backgroundColor = color;

            if (!shadeMode) {
                target.dataset.shadeIndex = 0;
            } else if (shadeMode) {
                const { shadeIndex } = target.dataset;
                const nextIndex = Number(shadeIndex) + 1;
                target.dataset.shadeIndex = nextIndex > 9 ? 9 : nextIndex;
            }
        }
    },
    createGrid() {
        grid.textContent = '';
        const { gridSize, blockSize } = settings.calculateGridSize();

        for (let i = 0; i < gridSize; i += 1) {
            const div = document.createElement('div');
            div.style.height = `${blockSize}px`;
            div.style.width = `${blockSize}px`;
            div.dataset.shadeIndex = 0;

            if (settings.gridMode) {
                div.classList.add('border');
            }
            div.addEventListener('mousedown', this.draw);

            div.addEventListener('mouseenter', this.draw);
            grid.appendChild(div);
        }
    },
    clearCanvas() {
        [...grid.children].forEach((block) => {
            const gridBlock = block;
            gridBlock.style.backgroundColor = '#fff';
            gridBlock.dataset.shadeIndex = 0;
        });
    },
    showPopup() {
        popup.classList.remove('hide');
    },
    hidePopup() {
        popup.classList.add('hide');
    },
    addGridLines() {
        [...grid.children].forEach((block) => block.classList.add('border'));
    },
    removeGridLines() {
        [...grid.children].forEach((block) => block.classList.remove('border'));
    },
    openMenu() {
        menu.classList.remove('hide');

        if (openMenuBtn.classList.contains('pulse')) {
            openMenuBtn.classList.remove('pulse');

            toast.remove();
        }
    },
    closeMenu() {
        menu.classList.add('hide');
    },
    checkIfPopupWasClicked(e) {
        if (popup.classList.contains('hide') || e.target.classList.contains('clear-btn')) return;
        const popupClicked = e.target.closest('.popup');

        if (!popupClicked) {
            this.hidePopup();
        }
    },
    checkForTheme() {
        const storedTheme =
            localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        if (storedTheme === 'light') {
            settings.darkMode = false;
        }
        if (storedTheme === 'dark') {
            settings.turnOnMode('darkMode');
        }
        if (storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);
    },
    setTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let targetTheme;

        if (currentTheme === 'light') {
            targetTheme = 'dark';
            settings.turnOnMode('darkMode');
        }
        if (currentTheme === 'dark') {
            targetTheme = 'light';
            settings.turnOffMode('darkMode');
        }

        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
    }
};

rangeInput.addEventListener('input', (e) => {
    rangeValue.textContent = `Size: ${e.target.value}x${e.target.value}`;
});

rangeInput.addEventListener('change', (e) => {
    const range = e.target.valueAsNumber;
    UI.createGrid(range);
});

colorInput.addEventListener('input', (e) => {
    colorValue.textContent = e.target.value;
    colors.colorInputColor = e.target.value;

    settings.turnOffMode('eraserMode', 'rainbowMode', 'shadeMode');
});

autoModeBtn.addEventListener('click', () => {
    if (settings.autoMode) {
        settings.turnOffMode('autoMode');
    } else {
        settings.turnOnMode('autoMode');
    }
});

eraserModeBtn.addEventListener('click', () => {
    const { eraserMode, rainbowMode, shadeMode } = settings;

    if (eraserMode) {
        settings.turnOffMode('eraserMode');
    } else {
        settings.turnOnMode('eraserMode');

        if (rainbowMode) {
            settings.turnOffMode('rainbowMode');
        }
        if (shadeMode) {
            settings.turnOffMode('shadeMode');
        }
    }
});

rainbowModeBtn.addEventListener('click', () => {
    const { eraserMode, rainbowMode, shadeMode } = settings;

    if (rainbowMode) {
        settings.turnOffMode('rainbowMode');
    } else {
        settings.turnOnMode('rainbowMode');

        if (eraserMode) {
            settings.turnOffMode('eraserMode');
        }
        if (shadeMode) {
            settings.turnOffMode('shadeMode');
        }
    }
});

shadeModeBtn.addEventListener('click', () => {
    const { eraserMode, rainbowMode, shadeMode } = settings;

    if (shadeMode) {
        settings.turnOffMode('shadeMode');
    } else {
        settings.turnOnMode('shadeMode');

        if (eraserMode) {
            settings.turnOffMode('eraserMode');
        }
        if (rainbowMode) {
            settings.turnOffMode('rainbowMode');
        }
    }
});

gridModeBtn.addEventListener('click', () => {
    if (settings.gridMode) {
        UI.removeGridLines();
        settings.turnOffMode('gridMode');
    } else {
        UI.addGridLines();
        settings.turnOnMode('gridMode');
    }
});

darkModeBtn.addEventListener('click', UI.setTheme);

clearBtn.addEventListener('click', UI.showPopup);

agreeBtn.addEventListener('click', () => {
    UI.clearCanvas();
    UI.hidePopup();
});

disagreeBtn.addEventListener('click', UI.hidePopup);
closeMenuBtn.addEventListener('click', UI.closeMenu);
openMenuBtn.addEventListener('click', UI.openMenu);

window.addEventListener('mousedown', () => {
    settings.mouseDown = true;
});
window.addEventListener('mouseup', () => {
    settings.mouseDown = false;
});
window.addEventListener('click', UI.checkIfPopupWasClicked.bind(UI));
window.addEventListener('resize', UI.createGrid.bind(UI));
window.addEventListener('DOMContentLoaded', () => {
    UI.createGrid();
    UI.checkForTheme();
});
