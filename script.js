// Firebaseの初期化
const firebaseConfig = {
    apiKey: "AIzaSyBekPnTQGqxZmIaFldNlbjrPWKb3_5MrBk",
    authDomain: "pasu-5c3c6.firebaseapp.com",
    projectId: "pasu-5c3c6",
    storageBucket: "pasu-5c3c6.firebasestorage.app",
    messagingSenderId: "465286810890",
    appId: "1:465286810890:web:71c3bf5b0d85d2245ffef3",
    measurementId: "G-5XXLK6SX2Y"
};

// FirebaseとFirestoreの初期化
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// キャラクタ頻度を記憶するオブジェクト
let characterFrequency = {};

// パスワード強度チェック関数
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
    updateDatabase();
}

// パスワードのアルファベットと数字を解析し頻度を更新
function analyzePassword(password) {
    for (let char of password) {
        if (characterFrequency[char]) {
            characterFrequency[char]++;
        } else {
            characterFrequency[char] = 1;
        }
    }
}

// Firestoreに頻度データを保存・更新する関数
async function updateDatabase() {
    try {
        const charFreqRef = db.collection("passwordStats").doc("characterFrequency");

        // データを保存、または既存データがあれば更新
        await charFreqRef.set(characterFrequency, { merge: true });
        console.log("データベースに保存しました");
    } catch (error) {
        console.error("データベース更新エラー:", error);
    }
}

// Firestoreからデータを取得し、characterFrequencyに読み込む
async function loadCharacterFrequency() {
    const charFreqRef = db.collection("passwordStats").doc("characterFrequency");
    const docSnap = await charFreqRef.get();

    if (docSnap.exists) {
        characterFrequency = docSnap.data();
        console.log("データベースからロードしました:", characterFrequency);
    } else {
        console.log("データが見つかりません");
    }
}

// ページ読み込み時にデータを取得
window.onload = loadCharacterFrequency;

// パスワード強度計算関数
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

// 統計表示
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

        }
    });
}
