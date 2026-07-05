const calculateInvestmentScore = (
    financialData,
    analysis,
    newsSentiment
) => {

    // -----------------------------
    // Financial Score
    // -----------------------------
    let financialScore = 50;

    // Large market cap companies are generally more stable
    if (financialData.marketCap > 1000000000000) {
        financialScore += 20;
    } else if (financialData.marketCap > 500000000000) {
        financialScore += 15;
    } else if (financialData.marketCap > 100000000000) {
        financialScore += 10;
    }

    // Higher stock price isn't always better,
    // but we'll use it as a simple indicator for now.
    if (financialData.currentPrice > 200) {
        financialScore += 10;
    } else if (financialData.currentPrice > 100) {
        financialScore += 5;
    }

    // Cap financial score at 100
    financialScore = Math.min(financialScore, 100);

    // -----------------------------
    // AI Confidence
    // -----------------------------
    const aiScore = analysis.confidence || 50;

    // -----------------------------
    // News Sentiment
    // -----------------------------
    const newsScore = newsSentiment.sentimentScore || 50;

    // -----------------------------
    // Weighted Final Score
    // -----------------------------
    const finalScore = Math.round(
        (financialScore * 0.5) +
        (aiScore * 0.3) +
        (newsScore * 0.2)
    );

    // -----------------------------
    // Recommendation
    // -----------------------------
    let recommendation = "HOLD";

    if (finalScore >= 80) {
        recommendation = "INVEST";
    } else if (finalScore < 60) {
        recommendation = "PASS";
    }

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