const logger = require('./logger.helper');

class ApiError extends Error {
    constructor(statusCode, message, code, traceID) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.traceID = traceID;
    }

    static unauthorized(traceID) {
        return new ApiError(
            401,
            'Unauthorized access',
            'AUTH001',
            traceID
        );
    }

    static badRequest(message, traceID = 'REQ001') {
        return new ApiError(
            400,
            message,
            'REQ001',
            traceID
        );
    }

    static notFound(traceID) {
        return new ApiError(
            404,
            'Resource not found',
            'RSC001',
            traceID
        );
    }

    static serverError(traceID) {
        return new ApiError(
            500,
            'Internal server error',
            'SRV001',
            traceID
        );
    }

    static handleError(error, methodName, additionalInfo = {}) {
        if (error instanceof ApiError) {
            logger.error(`${methodName} - ApiError`, {
                ...additionalInfo,
                errorType: 'ApiError',
                message: error.message,
                code: error.code,
                traceID: error.traceID
            });
            throw error;
        }

        logger.error(`${methodName} - UnknownError`, {
            ...additionalInfo,
            errorType: 'UnknownError',
            error: error.message,
            stack: error.stack
        });

        throw ApiError.serverError('INTERNAL_ERROR');
    }
}

module.exports = ApiError; 