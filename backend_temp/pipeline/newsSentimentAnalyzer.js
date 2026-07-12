const model = require("../config/langchain");
const { parseAIResponse } = require("../utils/jsonParser");

const analyzeNewsSentiment = async (companyNews) => {

    const prompt = `
You are a financial news analyst.

Analyze the following company news.

${JSON.stringify(companyNews, null, 2)}

Return ONLY valid JSON.

{{
  "overallSentiment": "Positive",
  "sentimentScore": 0,
  "summary": "",
  "keyInsights": []
}}

Rules:
- overallSentiment must be Positive, Neutral, or Negative.
- sentimentScore must be between 0 and 100.
- Return only JSON.
`;

    const response = await model.invoke(prompt);

    if (!response || !response.content) {
        throw new Error("No response received from Gemini.");
    }

    return parseAIResponse(response.content);
};

module.exports = {
    analyzeNewsSentiment
};