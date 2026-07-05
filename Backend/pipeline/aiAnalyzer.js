const model = require("../config/langchain");
const researchPrompt = require("../utils/researchPrompt");
const { parseAIResponse } = require("../utils/jsonParser");

const analyzeInvestment = async (
    financialData,
    companyNews
) => {

    const formattedPrompt =
        await researchPrompt.format({

            financialData:
                JSON.stringify(financialData, null, 2),

            news:
                JSON.stringify(companyNews, null, 2)

        });

    const response = await model.invoke(formattedPrompt);

    if (!response || !response.content) {
        throw new Error("No response received from Gemini.");
    }

    return parseAIResponse(response.content);

};

module.exports = {
    analyzeInvestment
};