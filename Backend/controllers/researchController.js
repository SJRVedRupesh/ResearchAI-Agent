const { researchCompany } = require("../services/researchService");

const analyzeCompany = async (req, res) => {

    try {

        const { company } = req.body;

        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Company name is required."
            });
        }

        const result = await researchCompany(company);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    analyzeCompany
};