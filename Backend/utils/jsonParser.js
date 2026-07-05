const parseAIResponse = (response) => {

    try {

        return JSON.parse(response);

    } catch (error) {

        throw new Error("Invalid JSON received from Gemini.");

    }

};

module.exports = {
    parseAIResponse
};