const { collectCompanyData } = require("../pipeline/dataCollector");
const { analyzeInvestment } = require("../pipeline/aiAnalyzer");
const { analyzeNewsSentiment } = require("../pipeline/newsSentimentAnalyzer");
const { calculateInvestmentScore } = require("../pipeline/scoreEngine");
const { generateReport } = require("../pipeline/reportGenerator");

const runInvestmentResearch = async (companyName) => {

    // Step 1: Collect financial data and latest news
    const {
        financialData,
        companyNews
    } = await collectCompanyData(companyName);

    // Step 2: Generate investment analysis
    const analysis = await analyzeInvestment(
        financialData,
        companyNews
    );

    // Step 3: Analyze news sentiment
    const newsSentiment = await analyzeNewsSentiment(
        companyNews
    );

    // Step 4: Calculate investment score
    const score = calculateInvestmentScore(
        financialData,
        analysis,
        newsSentiment
    );

    // Step 5: Generate final report
    return generateReport(
        companyName,
        financialData,
        companyNews,
        analysis,
        score,
        newsSentiment
    );

};

module.exports = {
    runInvestmentResearch
};