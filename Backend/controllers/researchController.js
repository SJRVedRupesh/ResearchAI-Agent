const { researchCompany } = require("../services/researchService");
const { formatInvestmentReport } = require("../utils/reportFormatter");

const analyzeCompany = async (req, res) => {
    try {
        const { company } = req.body;

        // Validate request
        if (!company || company.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Company name is required."
            });
        }

        // Run AI research
        const result = await researchCompany(company);

        // Format response
        const report = formatInvestmentReport(result);

        // Send response
        return res.status(200).json({
            success: true,
            message: "Investment research completed successfully.",
            data: report
        });

    } catch (error) {
        console.error("Research Controller Error:", {
            company: req.body.company,
            message: error.message
        });

        return res.status(500).json({
            success: false,
            message: "Failed to analyze company.",
            error: error.message
        });
    }
};

module.exports = {
    analyzeCompany
};