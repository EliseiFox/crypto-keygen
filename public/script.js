let mnemonicSize = 256;
generateButton = document.getElementById("generate-btn")
phraseSizeSelect = document.getElementById("phrase-size")
languageSelect = document.getElementById("languages")

let testRequest = async () => {
    mnemonicSize = parseInt(phraseSizeSelect.options[phraseSizeSelect.selectedIndex].value);
    language = languageSelect.options[languageSelect.selectedIndex].value;
    console.log(mnemonicSize);
    console.log(language);
    const response = await fetch('/api/data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ mnemonicSize: mnemonicSize, language: language}),
});
    const data = await response.json();
    
    document.getElementById('mnemonic').innerText = data.mnemonic;
    document.getElementById('bitcoinAddress').innerText = data.bitcoinAddress;
    document.getElementById('ethereumAddress').innerText = data.ethereumAddress;
    document.getElementById('solanaAddress').innerText = data.solanaAddress;
}

generateButton.addEventListener("click", testRequest)

testRequest();