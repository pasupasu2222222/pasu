const characterFrequency = {};

function checkPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('strength-indicator');
    const strengthText = document.getElementById('strength-text');
    const reasonDiv = document.getElementById('reason');
    
    const password = passwordInput.value;
    const result = calculatePasswordStrength(password);

    strengthIndicator.style.width = result.strength + '%';
    strengthText.textContent = result.strength + '%';
    reasonDiv.innerHTML = result.reason || '';

    analyzePassword(password);
    displayStatistics();
}

function generateRandomString(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset[randomIndex];
    }
    return result;
}

function calculatePasswordStrength(password) {
    let strength = 0;
    let reason = '';

    if (password.length >= 8) {
        strength += 40;
    } else {
        reason += 'パスワードの長さが短すぎます。 ';
        const remainingLength = 8 - password.length;
        const randomString = generateRandomString(remainingLength);
        password += randomString;
    }

    if (/[A-Z]/.test(password)) {
        strength += 25;
    } else {
        reason += '大文字が含まれていません。 ';
        const lowercaseIndex = Math.floor(Math.random() * password.length);
        const lowercaseChar = password.charAt(lowercaseIndex);
        const uppercaseChar = lowercaseChar.toUpperCase();
        password = password.substring(0, lowercaseIndex) + uppercaseChar + password.substring(lowercaseIndex + 1);
    }

    if (/\d/.test(password) && /[a-zA-Z]/.test(password)) {
        strength += 25;
    } else {
        reason += '数字とアルファベットの両方を使用してください。 ';
        const numberOptions = "0123456789";
        const randomNumber = numberOptions.charAt(Math.floor(Math.random() * numberOptions.length));
        password += randomNumber;

        const alphabetOptions = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomAlphabet = alphabetOptions.charAt(Math.floor(Math.random() * alphabetOptions.length));
        password += randomAlphabet;
    }

    if (/[!@#$%^&*(),.?":{}|<>_-]/.test(password)) {
        strength += 10;
    } else {
        reason += '記号を使用してセキュリティを向上させてください。 ';
        const symbolOptions = "-_";
        const randomSymbol = symbolOptions.charAt(Math.floor(Math.random() * symbolOptions.length));
        password += randomSymbol;
    }

    if (strength < 80) {
        reason += '<br><strong>改善案: ' + password + '</strong>';
    }

    strength = Math.max(0, Math.min(100, strength));

    return { strength, reason };
}

function analyzePassword(password) {
    for (let char of password) {
        if (characterFrequency[char]) {
            characterFrequency[char]++;
        } else {
            characterFrequency[char] = 1;
        }
    }
}

function displayStatistics() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = Object.keys(characterFrequency);
    const data = Object.values(characterFrequency);

    if (window.myChartInstance) {
        window.myChartInstance.destroy();
    }

    window.myChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Character Frequency',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
