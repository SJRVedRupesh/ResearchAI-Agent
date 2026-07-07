const { researchCompany } = require("../services/researchService");
const { researchSchema } = require("../validators/researchValidator");
const {
    successResponse,
    errorResponse
} = require("../utils/apiResponse");

const analyzeCompany = async (req, res) => {

    const start = Date.now();

    try {

        // Validate Request Body
        const { error, value } = researchSchema.validate(req.body);

        if (error) {
            return res.status(400).json(
                errorResponse(error.details[0].message)
            );
        }

        // Get validated company name
        const { company } = value;

        // Run AI Research
        const report = await researchCompany(company);

        // Add processing time
        report.metadata.processingTime =
            `${Date.now() - start} ms`;

        // Success Response
        return res.status(200).json(

            successResponse(

                report,

                "Investment research completed successfully."

            )

        );

    } catch (error) {

        console.error("Research Controller Error:", {
            company: req.body.company,
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