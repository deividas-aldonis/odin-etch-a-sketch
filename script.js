const rangeValue = document.querySelector('.range-value');
const rangeInput = document.querySelector('.range-input');
const grid = document.querySelector('.grid');

rangeInput.addEventListener('input', (e) => {
    rangeValue.textContent = e.target.value;
});

rangeInput.addEventListener('change', (e) => {
    const rangeInputValue = e.target.valueAsNumber;
    const { width: gridWidth } = grid.getBoundingClientRect();
    const blockSize = gridWidth / rangeInputValue;
    const blockInGrid = rangeInputValue ** 2;

    grid.textContent = '';

    for (let i = 0; i < blockInGrid; i += 1) {
        const div = document.createElement('div');
        div.style.height = `${blockSize}px`;
        div.style.width = `${blockSize}px`;
        grid.appendChild(div);
    }
});
