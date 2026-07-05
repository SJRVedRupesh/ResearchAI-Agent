const parseAIResponse = (response) => {
    try {
        // Remove markdown code fences if present
        const cleanedResponse = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleanedResponse);

    } catch (error) {
        console.error("Invalid AI Response:", response);
        throw new Error("Failed to parse AI response.");
    }
};

module.exports = {
    parseAIResponse
};