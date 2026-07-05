require("dotenv").config();

const { getCompanyNews } = require("./services/newsService");

(async () => {
    try {
        console.log("API KEY:", process.env.GNEWS_API_KEY);

        const news = await getCompanyNews("Microsoft");

        console.log(news);
    } catch (error) {
        console.error(error);
    }
})();