const buildInvestmentPrompt = (
    financialData,
    companyNews
) => {

    return `
You are a senior CFA investment analyst.

Financial Data:

${JSON.stringify(financialData, null, 2)}

Recent News:

${JSON.stringify(companyNews, null, 2)}

Based ONLY on this information, return ONLY valid JSON.

{
  "company":"",
  "industry":"",
  "summary":"",
  "strengths":[],
  "weaknesses":[],
  "risks":[],
  "recommendation":"",
  "confidence":0
}
`;

};

module.exports = {
    buildInvestmentPrompt
};