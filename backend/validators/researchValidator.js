const Joi = require("joi");

const researchSchema = Joi.object({

    company: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({

            "string.base": "Company name must be a string.",

            "string.empty": "Company name cannot be empty.",

            "string.min": "Company name must contain at least 2 characters.",

            "string.max": "Company name cannot exceed 100 characters.",

            "any.required": "Company name is required."

        })

});

module.exports = {
    researchSchema
};