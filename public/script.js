const generateButton = document.getElementById("generate-btn")
const importButton = document.getElementById("import-btn")
const phraseSizeSelect = document.getElementById("phrase-size")
const languageSelect = document.getElementById("languages")

let mnemonicSize = 256;
let language = 'english';

/**
 * Normalizes a string by removing extra spaces, converting to lowercase, 
 * and applying NFKD normalization.
 */
function normalizeString(str) {
    if (typeof str !== 'string') return '';
    return str
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .normalize('NFKD');
}

let testRequest = async (isImport = false) => {
    mnemonicSize = parseInt(phraseSizeSelect.options[phraseSizeSelect.selectedIndex].value);
    language = languageSelect.options[languageSelect.selectedIndex].value;
    let mnemonicInput = document.getElementById('mnemonic-input').value;
    
    if (isImport) {
        if (!mnemonicInput.trim()) {
            alert('Please paste a mnemonic phrase to import.');
            return;
        }
        mnemonicInput = normalizeString(mnemonicInput);
    }

    const coinSelect = document.getElementById('coin-select');
    const selectedOption = coinSelect.options[coinSelect.selectedIndex];
    if (!selectedOption) {
        alert('Please select a coin.');
        return;
    }

    const selectedCoin = { coinKey: selectedOption.value };
    if (selectedOption.dataset.variant) {
        selectedCoin.variant = selectedOption.dataset.variant;
    }

    // Advanced derivation settings
    const purpose = document.getElementById('purpose-select').value;
    const account = parseInt(document.getElementById('account-input').value) || 0;
    const external = parseInt(document.getElementById('change-input').value) || 0;

    try {
        const requestData = { 
            mnemonicSize: mnemonicSize, 
            language: language,
            coin: selectedCoin,
            derivation: {
                purpose: purpose,
                account: account,
                change: external
            }
        };

        if (isImport) {
            requestData.mnemonic = mnemonicInput;
        }

        const response = await fetch('/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(requestData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }
        const data = await response.json();
        
        document.getElementById('mnemonic').innerText = data.mnemonic;
        document.getElementById('seed').innerText = data.seed;
        
        // Update the textarea with the mnemonic (newly generated or formatted imported)
        document.getElementById('mnemonic-input').value = data.mnemonic;
        
        const walletsDisplay = document.getElementById('wallets-display');
        walletsDisplay.innerHTML = '';

        const result = data.result;
        const section = document.createElement('div');
        section.className = 'wallet-section';
        
        const title = document.createElement('div');
        title.className = 'wallet-title';
        title.innerText = `${result.coinKey} ${result.variant ? `(${result.variant})` : ''}`;
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'wallet-grid';

        const fields = [
            { label: 'Root Key', value: result.rootKey },
            { label: 'Extended Private Key', value: result.extendedPrivateKey },
            { label: 'Derivation Path', value: result.derivationPath }
        ];

        fields.forEach(f => {
            const keyDiv = document.createElement('div');
            keyDiv.className = 'key';
            keyDiv.innerText = f.label;
            grid.appendChild(keyDiv);

            const valDiv = document.createElement('div');
            valDiv.className = 'value';
            valDiv.innerText = f.value;
            grid.appendChild(valDiv);
        });

        const addrKey = document.createElement('div');
        addrKey.className = 'key';
        addrKey.innerText = 'Addresses';
        grid.appendChild(addrKey);

        const addrVal = document.createElement('div');
        addrVal.className = 'value';
        const addrList = document.createElement('div');
        addrList.id = 'addresses';
        result.addresses.forEach(addr => {
            const div = document.createElement('div');
            div.style.marginBottom = '5px';
            div.innerText = `${addr.path}: ${addr.address}`;
            addrList.appendChild(div);
        });
        addrVal.appendChild(addrList);
        grid.appendChild(addrVal);

        section.appendChild(grid);
        walletsDisplay.appendChild(section);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data from server. Check console for details.');
    }
}

generateButton.addEventListener("click", () => testRequest(false))
importButton.addEventListener("click", () => testRequest(true))

testRequest(false);