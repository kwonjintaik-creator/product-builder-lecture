// Common elements
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Theme Toggle Logic
if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = '라이트 모드 켜기';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        themeToggle.textContent = isDarkMode ? '라이트 모드 켜기' : '다크 모드 켜기';
    });
}

// Lotto Logic
const generatorBtn = document.getElementById('generator-btn');
const lottoNumbersContainer = document.getElementById('lotto-numbers');

if (generatorBtn && lottoNumbersContainer) {
    generatorBtn.addEventListener('click', () => {
        lottoNumbersContainer.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
        for (const number of sortedNumbers) {
            const circle = document.createElement('div');
            circle.classList.add('lotto-number');
            circle.textContent = number;
            lottoNumbersContainer.appendChild(circle);
        }
    });
}

// Animal Face Test Logic
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/XM_DUkmKI/";
let model, maxPredictions;

const imageInput = document.getElementById('image-input');
const uploadArea = document.getElementById('upload-area');
const previewImage = document.getElementById('preview-image');
const uploadLabel = document.getElementById('upload-label');
const resultContainer = document.getElementById('result-container');
const resultMessage = document.getElementById('result-message');
const labelsDiv = document.getElementById('label-container');
const loadingSpinner = document.getElementById('loading-spinner');
const retryBtn = document.getElementById('retry-btn');

if (imageInput && uploadArea) {
    async function initAnimalModel() {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    }

    uploadArea.addEventListener('click', () => imageInput.click());

    imageInput.addEventListener('change', async (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = async (event) => {
                previewImage.src = event.target.result;
                previewImage.style.display = 'block';
                uploadLabel.style.display = 'none';
                
                await startAnalysis();
            };
            reader.readAsDataURL(file);
        }
    });

    async function startAnalysis() {
        loadingSpinner.style.display = 'block';
        resultContainer.style.display = 'none';
        
        if (!model) await initAnimalModel();
        
        const prediction = await model.predict(previewImage);
        loadingSpinner.style.display = 'none';
        resultContainer.style.display = 'block';
        
        displayResults(prediction);
    }

    function displayResults(prediction) {
        labelsDiv.innerHTML = '';
        prediction.sort((a, b) => b.probability - a.probability);
        
        const topResult = prediction[0];
        resultMessage.textContent = `당신은 ${topResult.className}상입니다!`;
        
        prediction.forEach(p => {
            const prob = (p.probability * 100).toFixed(2);
            const barHtml = `
                <div class="result-bar-wrapper">
                    <div class="result-label">
                        <span>${p.className}</span>
                        <span>${prob}%</span>
                    </div>
                    <div class="result-bar-bg">
                        <div class="result-bar-fill" style="width: ${prob}%"></div>
                    </div>
                </div>
            `;
            labelsDiv.insertAdjacentHTML('beforeend', barHtml);
        });
    }

    retryBtn.addEventListener('click', () => {
        imageInput.value = '';
        previewImage.style.display = 'none';
        uploadLabel.style.display = 'block';
        resultContainer.style.display = 'none';
    });
}
