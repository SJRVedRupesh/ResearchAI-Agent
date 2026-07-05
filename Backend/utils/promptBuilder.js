const buildInvestmentPrompt = (company) => {

    return `
You are a senior investment analyst.

Analyze the company "${company}".

Return ONLY valid JSON.

The JSON schema is:

{
  "company": "",
  "industry": "",
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "risks": [],
  "recommendation": "",
  "confidence": 0
}

Rules:

Do not write markdown.

Do not use triple backticks.

Return only JSON.

`;

};

module.exports = {
    buildInvestmentPrompt
};