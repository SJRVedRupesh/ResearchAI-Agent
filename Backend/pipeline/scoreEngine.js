const calculateInvestmentScore = (
    financialData,
    analysis
) => {

    let score = 50;

    if (financialData.marketCap > 500000000000) {
        score += 20;
    }

    if (financialData.currentPrice > 100) {
        score += 10;
    }

    score += Math.round((analysis.confidence || 50) * 0.2);

    score = Math.min(score, 100);

    let recommendation = "HOLD";

    if (score >= 80)
        recommendation = "INVEST";

    else if (score < 60)
        recommendation = "PASS";

    return {

        score,

        recommendation

    };

};

module.exports = {
    calculateInvestmentScore
};