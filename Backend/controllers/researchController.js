const { researchCompany } = require("../services/researchService");
const { researchSchema } = require("../validators/researchValidator");
const {
    successResponse,
    errorResponse
} = require("../utils/apiResponse");

const analyzeCompany = async (req, res) => {

    const start = Date.now();

    // Available in both try and catch
    let company = req.body.company;

    try {

        // Validate request
        const { error, value } = researchSchema.validate(req.body);

        if (error) {
            return res.status(400).json(
                errorResponse(error.details[0].message)
            );
        }

        // Use validated value
        company = value.company;

        // Generate report
        const report = await researchCompany(company);

        // Processing time
        report.metadata.processingTime =
            `${Date.now() - start} ms`;

        return res.status(200).json(
            successResponse(
                report,
                "Investment research completed successfully."
            )
        );

    } catch (error) {

        console.error("Research Controller Error:", {
            company,
            message: error.message,
            stack: error.stack
        });

        return res.status(500).json(
            errorResponse(
                "Failed to analyze company.",
                error.message
            )
        );

    }

};

module.exports = {
    analyzeCompany
};