import express from 'express'
const app = express();
const PORT = process.env.PORT || 3000;

import mnemonicGen from './keygen.js'; 
import { getDetailedWalletData } from './keygen-trust-wallet.js';
import { initWasm } from '@trustwallet/wallet-core';

// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.static('public'));

app.post('/api/data', async (req, res) => {
    try {
        const { mnemonicSize, language, mnemonic: importedMnemonic, coins } = req.body;
        console.log('Received request for:', coins);
        
        let mnemonic = importedMnemonic;

        const core = await initWasm();
        const { HDWallet, Mnemonic } = core;

        if (mnemonic) {
            // Validate imported mnemonic
            if (!Mnemonic.isValid(mnemonic)) {
                return res.status(400).json({ error: 'Invalid mnemonic phrase' });
            }
        } else {
            // Generate a new mnemonic using keygen.js to support languages
            const baseMnemonicData = mnemonicGen(mnemonicSize, language);
            mnemonic = baseMnemonicData.mnemonic;
        }

        const results = [];
        for (const coinReq of coins) {
            const data = await getDetailedWalletData({
                mnemonic: mnemonic,
                coinKey: coinReq.coinKey,
                variant: coinReq.variant || 'native',
                account: 0
            });
            data.coinKey = coinReq.coinKey;
            data.variant = coinReq.variant;
            results.push(data);
        }

        res.json({
            mnemonic: mnemonic,
            seed: results[0].seed,
            results: results
        });
    } catch (error) {
        console.error('Error generating data:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is Active On: http://localhost:${PORT}`);
});