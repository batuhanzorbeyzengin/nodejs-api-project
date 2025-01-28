const httpClient = require('../../helpers/http.helper');
const redisClient = require('../../helpers/redis.helper');
const logger = require('../../helpers/logger.helper');
const ApiError = require('../../helpers/error.helper');
const config = require('../../config');

class ProductListService {
    static MAX_OFFSET = 200;
    static MIN_LIMIT = 10;
    static MAX_LIMIT = 200;

    async execute(offset = 0, limit = 50, token) {
        try {
            if (!token) {
                throw ApiError.unauthorized('Authorization token is required');
            }

            const sanitizedOffset = Math.max(0, Math.min(offset, ProductListService.MAX_OFFSET));
            const sanitizedLimit = Math.max(ProductListService.MIN_LIMIT, Math.min(limit, ProductListService.MAX_LIMIT));

            const cacheKey = redisClient.generateKey('products:list', { offset: sanitizedOffset, limit: sanitizedLimit });

            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                logger.info('Products list retrieved from cache', { offset: sanitizedOffset, limit: sanitizedLimit });
                return cachedData;
            }

            try {
                const response = await httpClient.get('/product', {
                    params: {
                        offset: sanitizedOffset,
                        limit: sanitizedLimit
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const { data } = response;
                const result = {
                    products: data,
                    total: data.length,
                    offset: sanitizedOffset,
                    limit: sanitizedLimit
                };

                await redisClient.set(cacheKey, result, config.cache.productListTtl);
                logger.info('Products list cached', { offset: sanitizedOffset, limit: sanitizedLimit });

                return result;
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    throw ApiError.unauthorized('Invalid or expired token');
                }
                throw error;
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            logger.error('getProducts error', { error });
            throw ApiError.handleError(error, 'getProducts');
        }
    }
}

module.exports = new ProductListService(); 