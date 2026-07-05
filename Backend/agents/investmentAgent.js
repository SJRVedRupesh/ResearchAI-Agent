const { collectCompanyData } = require("../pipeline/dataCollector");
const { analyzeInvestment } = require("../pipeline/aiAnalyzer");
const { calculateInvestmentScore } = require("../pipeline/scoreEngine");
const { generateReport } = require("../pipeline/reportGenerator");

const runInvestmentResearch = async (companyName) => {

    const {
        financialData,
        companyNews
    } = await collectCompanyData(companyName);

    const analysis =
        await analyzeInvestment(
            financialData,
            companyNews
        );

    const score =
        calculateInvestmentScore(
            financialData,
            analysis
        );

    return generateReport(
        companyName,
        financialData,
        companyNews,
        analysis,
        score
    );

};

module.exports = {
    runInvestmentResearch
};