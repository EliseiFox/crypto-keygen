const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;


app.use(express.static('public'));

app.get('/api/data', (req, res) => {
    res.json({ message: "This is response frome Node.js server!" });
    console.log("request from client.")
});

app.listen(PORT, () => {
    console.log(`Server is Active On: http://localhost:${PORT}`);
});