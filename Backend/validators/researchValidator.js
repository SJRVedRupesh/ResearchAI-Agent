const Joi = require("joi");

const researchSchema = Joi.object({

    company: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()

});

module.exports = {
    researchSchema
};