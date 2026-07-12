const calculateInvestmentScore = (
    financialData,
    aiAnalysis,
    newsAnalysis
) => {

    let financialScore = 50;

    // Market Cap Score
    if (financialData.marketCap > 500000000000) {
        financialScore += 20;
    }

    // Current Price
    if (financialData.currentPrice > 100) {
        financialScore += 10;
    }

    // AI Confidence
    const aiScore = aiAnalysis.confidence || 50;

    // News Score
    const newsScore = newsAnalysis.sentimentScore || 50;

    const finalScore = Math.round(

        financialScore * 0.5 +

        aiScore * 0.3 +

        newsScore * 0.2

    );

    let recommendation = "HOLD";

    if (finalScore >= 80)
        recommendation = "INVEST";

    else if (finalScore < 60)
        recommendation = "PASS";

    return {

        financialScore,

        aiScore,

        newsScore,

        finalScore,

        recommendation

    };

};

module.exports = {

    calculateInvestmentScore

};