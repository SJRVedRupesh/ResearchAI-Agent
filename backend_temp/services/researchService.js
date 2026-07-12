const { runInvestmentResearch } = require("../agents/investmentAgent");

const {
    getCachedReport,
    saveReport
} = require("../cache/reportCache");

const researchCompany = async (companyName) => {

    // Check Cache
    const cachedReport =
        getCachedReport(companyName);

    if (cachedReport) {

        console.log(`✅ Cache Hit: ${companyName}`);

        return cachedReport;

    }

    console.log(`🌐 Cache Miss: ${companyName}`);

    // Generate Report
    const report =
        await runInvestmentResearch(companyName);

    // Save to Cache
    saveReport(companyName, report);

    return report;

};

module.exports = {

    researchCompany

};