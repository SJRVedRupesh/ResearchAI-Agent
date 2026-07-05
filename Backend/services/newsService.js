const axios = require("axios");

const getCompanyNews = async (companyName) => {

    try {

        const response = await axios.get(
            "https://gnews.io/api/v4/search",
            {
                params: {
                    q: companyName,
                    token: process.env.GNEWS_API_KEY,
                    lang: "en",
                    max: 5
                }
            }
        );

        const articles = response.data.articles || [];

        return articles.map(article => ({
            title: article.title,
            description: article.description,
            source: article.source.name,
            publishedAt: article.publishedAt,
            url: article.url
        }));

    } catch (error) {
    console.error("GNews API Error:");

    if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
    } else {
        console.error(error.message);
    }

    throw error;
}

};

module.exports = {
    getCompanyNews
};