const {
    runInvestmentResearch
} = require("../agents/investmentAgent");

const researchCompany = async (companyName) => {
    return await runInvestmentResearch(companyName);
};

module.exports = {
    researchCompany
};