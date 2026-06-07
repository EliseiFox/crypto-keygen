import express from 'express'
const app = express();
const PORT = process.env.PORT || 3000;

import { getDetailedWalletData, mnemonicJsonGen as mnemonicGen } from './keygen-trust-wallet.js';
import { initWasm } from '@trustwallet/wallet-core';

// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.static('public'));

app.post('/api/data', async (req, res) => {
    try {
        const { mnemonicSize, language, mnemonic: importedMnemonic, coin, derivation } = req.body;
        console.log('Received request for:', coin.coinKey);


        if(derivation.change<0) {console.log(333)}
        console.log(derivation.change);
        
        const data = await getDetailedWalletData({
            mnemonic: importedMnemonic,
            mnemonicSize: mnemonicSize,
            language: language,
            coinKey: coin.coinKey,
            variant: derivation?.purpose || coin.variant || 'native',
            account: derivation?.account || 0,
            change: derivation?.change || 0,
            startIndex: derivation?.startIndex || 0
        });
        data.coinKey = coin.coinKey;
        data.variant = derivation?.purpose || coin.variant;

        res.json({
            mnemonic: data.mnemonic,
            seed: data.seed,
            result: data
        });
    } catch (error) {
        console.error('Error generating data:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is Active On: http://localhost:${PORT}`);
});