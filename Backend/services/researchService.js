const model = require("../config/langchain");
const researchPrompt = require("../utils/researchPrompt");

const { getCompanyFinancials } = require("./financialService");
const { getCompanyNews } = require("./newsService");

const { parseAIResponse } = require("../utils/jsonParser");

const researchCompany = async (companyName) => {
    try {
        // Fetch financial data and news in parallel
        const [financialData, companyNews] = await Promise.all([
            getCompanyFinancials(companyName),
            getCompanyNews(companyName)
        ]);

        // Convert data into formatted strings for the prompt
        const financialContext = JSON.stringify(financialData, null, 2);
        const newsContext = JSON.stringify(companyNews, null, 2);

        // Generate the prompt
        const formattedPrompt = await researchPrompt.format({
            financialData: financialContext,
            news: newsContext
        });

        // Invoke Gemini through LangChain
        const response = await model.invoke(formattedPrompt);

        // Validate AI response
        if (!response || !response.content) {
            throw new Error("No response received from Gemini.");
        }

        // Parse AI JSON response
        const analysis = parseAIResponse(response.content);

        // Return final response
        return {
            company: companyName,
            generatedAt: new Date().toISOString(),
            financialData,
            companyNews,
            analysis
        };

    } catch (error) {
        console.error("Research Service Error:", {
            company: companyName,
            message: error.message,
            stack: error.stack
        });

        throw error;
    }
};

module.exports = {
    researchCompany
};