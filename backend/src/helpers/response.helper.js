class ApiResponse {
    static success(message, data = null, meta = {}) {
        return {
            success: true,
            message,
            data,
            meta,
            timestamp: new Date().toISOString()
        };
    }

    static error(error) {
        return {
            success: false,
            errors: [{
                message: error.message || 'An error occurred',
                code: error.code || 'ERROR',
                traceID: error.traceID || 'UNKNOWN'
            }],
            timestamp: new Date().toISOString()
        };
    }

    static paginate(data, page, limit, total) {
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return this.success('Data retrieved successfully', data, {
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage,
                hasPrevPage
            }
        });
    }
}

module.exports = ApiResponse; 