const { getCompanyFinancials } = require("./services/financialService");

(async () => {

    const data = await getCompanyFinancials("Microsoft");

    console.log(data);

})();