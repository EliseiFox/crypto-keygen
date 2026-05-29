import express from 'express'
const app = express();
const PORT = 3000;

import mnemonicGen from './keygen.js'; 

// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.static('public'));

app.post('/api/data', (req, res) => {
    const genParametrs = req.body;
    const mnemonicSize = genParametrs.mnemonicSize;
    const language = genParametrs.language;
    console.log('Received:', genParametrs);
    const mnemonic = mnemonicGen(mnemonicSize, language);
    console.log(mnemonic);

    res.json(mnemonic);
});

app.listen(PORT, () => {
    console.log(`Server is Active On: http://localhost:${PORT}`);
});