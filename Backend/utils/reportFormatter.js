const formatInvestmentReport = (report) => {

    return {
        generatedAt: report.generatedAt,
        company: report.company,
        recommendation: report.analysis.recommendation,
        confidence: report.analysis.confidence,
        summary: report.analysis.summary,
        strengths: report.analysis.strengths,
        weaknesses: report.analysis.weaknesses,
        risks: report.analysis.risks,
        financialData: report.financialData,
        latestNews: report.companyNews
    };

};

module.exports = {
    formatInvestmentReport
};