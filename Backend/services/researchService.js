const { getCompanyFinancials } = require("./financialService");
const { generateInvestmentAnalysis } = require("./geminiService");

const buildPrompt = (financialData) => {
    return `
You are a professional CFA investment analyst.

Analyze the company using the financial information below.

Financial Data:
${JSON.stringify(financialData, null, 2)}

Return ONLY valid JSON in this format:

{
  "company": "",
  "industry": "",
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "risks": [],
  "recommendation": "INVEST | HOLD | PASS",
  "confidence": 0
}
`;
};

const researchCompany = async (companyName) => {

    // Step 1: Fetch financial data
    const financialData = await getCompanyFinancials(companyName);

    // Step 2: Build AI prompt
    const prompt = buildPrompt(financialData);

    // Step 3: Generate AI analysis
    const analysis = await generateInvestmentAnalysis(prompt);

    // Step 4: Return response
    return {
        financialData,
        analysis
    };
};

module.exports = {
    researchCompany
};