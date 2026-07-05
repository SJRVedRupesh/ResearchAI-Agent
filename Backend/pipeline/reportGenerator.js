const generateReport = (
    companyName,
    financialData,
    companyNews,
    analysis,
    score
) => {

    return {

        generatedAt: new Date().toISOString(),

        company: companyName,

        financialData,

        latestNews: companyNews,

        analysis,

        investmentScore: score.score,

        recommendation: score.recommendation

    };

};

module.exports = {
    generateReport
};