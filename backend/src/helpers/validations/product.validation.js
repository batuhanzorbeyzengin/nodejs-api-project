const Joi = require('joi');

const productSchemas = {
    checkEligibility: Joi.object({
        countryCode: Joi.string().optional(),
        currency: Joi.string().required().messages({
            'string.empty': 'Currency is required',
            'any.required': 'Currency is required'
        }),
        price: Joi.number().required().greater(0).messages({
            'number.base': 'Price must be a number',
            'number.greater': 'Price must be greater than 0',
            'any.required': 'Price is required'
        })
    })
};

module.exports = productSchemas; 