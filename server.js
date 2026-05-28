import express from 'express'
const app = express();
const PORT = 3000;

import mnemonicGen from './keygen.js'; 

app.use(express.static('public'));

app.get('/api/data', (req, res) => {
    const mnemonic = mnemonicGen();
    console.log(mnemonic);

    res.json(mnemonic);
});

app.listen(PORT, () => {
    console.log(`Server is Active On: http://localhost:${PORT}`);
});