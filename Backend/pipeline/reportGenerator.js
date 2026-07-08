const generateReport = (
    companyName,
    financialData,
    companyNews,
    analysis,
    score,
    newsSentiment
) => {

    return {

        metadata: {
            generatedAt: new Date().toISOString(),
            model: "Gemini 2.5 Flash",
            version: "1.0.0",
            processingTime: "Calculated in Controller"
        },

        company: {
            name: companyName,
            symbol: financialData.symbol,
            sector: financialData.sector,
            industry: financialData.industry
        },

        executiveSummary: {
            summary: analysis.summary,
            futureOutlook: analysis.futureOutlook
        },

        investmentDecision: {
            recommendation: score.recommendation,
            confidence: score.finalScore
        },

        financialHealth: {
            marketCap: financialData.marketCap,
            currentPrice: financialData.currentPrice,
            currency: financialData.currency,
            exchange: financialData.exchange,
            fiftyTwoWeekHigh: financialData.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: financialData.fiftyTwoWeekLow
        },

        newsSentiment: {
            overall: newsSentiment.overallSentiment,
            score: newsSentiment.sentimentScore,
            summary: newsSentiment.summary,
            keyInsights: newsSentiment.keyInsights
        },

        strengths: analysis.strengths,

        weaknesses: analysis.weaknesses,

        risks: analysis.risks,

        latestNews: companyNews

    };

};

module.exports = {
    generateReport
};