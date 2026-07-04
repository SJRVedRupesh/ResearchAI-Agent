const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("AI Investment Backend is Running 🚀");
});

app.get('/api/test', (req, res) => {
    res.json({
        message: "Hello from the AI Investment Backend!"
    });
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});