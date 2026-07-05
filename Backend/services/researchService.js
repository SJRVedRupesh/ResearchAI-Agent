const model = require("../config/langchain");
const researchPrompt = require("../utils/researchPrompt");

const { getCompanyFinancials } = require("./financialService");
const { getCompanyNews } = require("./newsService");

const { parseAIResponse } = require("../utils/jsonParser");

const researchCompany = async (companyName) => {
    try {
        // Step 1: Fetch financial data
        const financialData = await getCompanyFinancials(companyName);

        // Step 2: Fetch latest company news
        const companyNews = await getCompanyNews(companyName);

        // Step 3: Format the prompt using LangChain PromptTemplate
        const formattedPrompt = await researchPrompt.format({
            financialData: JSON.stringify(financialData, null, 2),
            news: JSON.stringify(companyNews, null, 2)
        });

        // Step 4: Invoke Gemini through LangChain
        const response = await model.invoke(formattedPrompt);

        // Step 5: Get AI response
        const aiOutput = response.content;

        // Step 6: Parse JSON response
        const analysis = parseAIResponse(aiOutput);

        // Step 7: Return complete response
        return {
            financialData,
            companyNews,
            analysis
        };

    } catch (error) {
        console.error("Research Service Error:", error);
        throw error;
    }
};

module.exports = {
    researchCompany
};