const generatorBtn = document.getElementById('generator-btn');
const lottoNumbersContainer = document.getElementById('lotto-numbers');

generatorBtn.addEventListener('click', () => {
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    for (const number of numbers) {
        const circle = document.createElement('div');
        circle.classList.add('lotto-number');
        circle.textContent = number;
        lottoNumbersContainer.appendChild(circle);
    }
});