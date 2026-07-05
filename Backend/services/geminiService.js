const model = require("../config/gemini");

const generateInvestmentAnalysis = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);

        const response = await result.response;

        return response.text();

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw new Error("Failed to generate AI analysis.");
    }
};

module.exports = {
    generateInvestmentAnalysis
};