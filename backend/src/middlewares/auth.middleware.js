const ApiError = require('../helpers/error.helper');

const validateBearerToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(ApiError.unauthorized('NO_AUTH_HEADER'));
        }

        const [bearer, token] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !token) {
            return next(ApiError.unauthorized('INVALID_AUTH_FORMAT'));
        }

        req.token = token;
        next();
    } catch (error) {
        next(ApiError.unauthorized('AUTH_ERROR'));
    }
};

module.exports = validateBearerToken;