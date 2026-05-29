let testRequest = async () => {
    // Делаем запрос к нашему серверу
    const response = await fetch('/api/data');
    const data = await response.json();
    
    document.getElementById('mnemonic').innerText = data.mnemonic;
    document.getElementById('bitcoinAddress').innerText = data.bitcoinAddress;
    document.getElementById('ethereumAddress').innerText = data.ethereumAddress;
    document.getElementById('solanaAddress').innerText = data.solanaAddress;
}

testRequest();