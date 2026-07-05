const { generateInvestmentAnalysis } = require("./geminiService");

const buildPrompt = (companyName) => {
    return `
You are a senior investment analyst.

Analyze the company "${companyName}".

Evaluate the following:

1. Company Overview
2. Industry
3. Business Summary
4. Key Strengths
5. Key Weaknesses
6. Major Risks
7. Growth Opportunities
8. Investment Recommendation (INVEST / HOLD / PASS)
9. Confidence Score (0-100)

Keep the response professional and concise.
`;
};

const researchCompany = async (companyName) => {
    const prompt = buildPrompt(companyName);

    const analysis = await generateInvestmentAnalysis(prompt);

    return {
        company: companyName,
        analysis
    };
};

module.exports = {
    researchCompany
};