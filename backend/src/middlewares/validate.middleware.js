const ApiError = require('../helpers/error.helper');

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return next(ApiError.badRequest(errorMessage));
        }

        req.body = value;
        next();
    };
};

module.exports = validate; 