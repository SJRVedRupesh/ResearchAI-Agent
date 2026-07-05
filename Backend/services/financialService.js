const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance();

const getCompanyFinancials = async (companyName) => {

    try {

        const search = await yahooFinance.search(companyName);

        if (!search.quotes.length) {
            throw new Error("Company not found");
        }

        const symbol = search.quotes[0].symbol;

        const quote = await yahooFinance.quote(symbol);

        return {

            companyName: quote.longName,

            symbol: quote.symbol,

            sector: quote.sector || "Not Available",

            industry: quote.industry || "Not Available",

            currentPrice: quote.regularMarketPrice,

            marketCap: quote.marketCap,

            currency: quote.currency,

            exchange: quote.fullExchangeName,

            fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,

            fiftyTwoWeekLow: quote.fiftyTwoWeekLow

        };

    }

    catch (error) {

        throw new Error(error.message);

    }

};

module.exports = {

    getCompanyFinancials

};