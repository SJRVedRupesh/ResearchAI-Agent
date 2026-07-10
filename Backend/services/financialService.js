const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance();

const getCompanyFinancials = async (companyName) => {

    try {

        const search = await yahooFinance.search(companyName);

        // Filter quotes to only those that have a valid symbol
        const validQuotes = search.quotes.filter(q => q.symbol);

        if (!validQuotes.length) {
            return {
                companyName: companyName,
                symbol: "N/A",
                sector: "Not Available",
                industry: "Not Available",
                currentPrice: 0,
                marketCap: 0,
                currency: "USD",
                exchange: "N/A",
                fiftyTwoWeekHigh: 0,
                fiftyTwoWeekLow: 0
            };
        }

        const symbol = validQuotes[0].symbol;

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