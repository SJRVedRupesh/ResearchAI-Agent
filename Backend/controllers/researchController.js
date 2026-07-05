const { researchCompany } = require("../services/researchService");

const analyzeCompany = async (req, res) => {
    const start = Date.now();

    try {
        const { company } = req.body;

        // Validate request
        if (!company || company.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Company name is required."
            });
        }

        // Run the AI Investment Research Agent
        const report = await researchCompany(company);

        // Add processing time to metadata
        report.metadata.processingTime = `${Date.now() - start} ms`;

        // Send final response
        return res.status(200).json({
            success: true,
            message: "Investment research completed successfully.",
            data: report
        });

    } catch (error) {

        console.error("Research Controller Error:", {
            company: req.body.company,
            message: error.message,
            stack: error.stack
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