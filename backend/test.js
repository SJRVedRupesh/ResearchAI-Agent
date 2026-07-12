const axios = require('axios');
require('dotenv').config();

async function main() {
    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const models = response.data.models.map(m => m.name);
        console.log(models);
    } catch (e) {
        console.error(e.response ? e.response.data : e.message);
    }
}
main();
