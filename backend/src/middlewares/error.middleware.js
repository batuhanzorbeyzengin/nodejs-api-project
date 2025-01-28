const ApiResponse = require('../helpers/response.helper');
const logger = require('../helpers/logger.helper');

const errorHandler = (err, req, res, next) => {
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        code: err.code,
        statusCode: err.statusCode
    });

    if (err.name === 'ValidationError') {
        return res.status(400).json(
            ApiResponse.error({
                message: 'Validation Error',
                code: 'VALIDATION_ERROR',
                traceID: err.traceID || 'VAL001'
            })
        );
    }

    if (err.name === 'UnauthorizedError' || err.statusCode === 401) {
        return res.status(401).json(
            ApiResponse.error({
                message: err.message || 'Unauthorized Access',
                code: err.code || 'AUTH001',
                traceID: err.traceID || 'AUTH001'
            })
        );
    }

    // Default error
    return res.status(err.statusCode || 500).json(
        ApiResponse.error({
            message: err.message || 'Internal Server Error',
            code: err.code || 'SERVER001',
            traceID: err.traceID || 'SRV001'
        })
    );
};

module.exports = errorHandler; 