const { getCompanyFinancials } = require("../services/financialService");
const { getCompanyNews } = require("../services/newsService");

const collectCompanyData = async (companyName) => {

    const [financialData, companyNews] = await Promise.all([
        getCompanyFinancials(companyName),
        getCompanyNews(companyName)
    ]);

    return {
        financialData,
        companyNews
    };
};

module.exports = {
    collectCompanyData
};