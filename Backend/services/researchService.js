const researchCompany = async (companyName) => {

    return {
        company: companyName,
        recommendation: "Pending AI Analysis",
        confidence: 0,
        summary: "Research service is working successfully."
    };

};

module.exports = {
    researchCompany
};