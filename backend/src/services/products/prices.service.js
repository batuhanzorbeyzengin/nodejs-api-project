const redisClient = require('../../helpers/redis.helper');
const logger = require('../../helpers/logger.helper');
const ApiError = require('../../helpers/error.helper');
const httpClient = require('../../helpers/http.helper');
const config = require('../../config');

class ProductPricesService {
    async execute(id, page = 1, limit = 10, token) {
        try {
            if (!id) {
                throw ApiError.badRequest('Product ID is required');
            }

            if (!token) {
                throw ApiError.unauthorized('Authorization token is required');
            }

            const pricesCacheKey = redisClient.generateKey('product:prices', { id });
            const cachedPrices = await redisClient.get(pricesCacheKey);

            if (!cachedPrices) {
                try {
                    const response = await httpClient.get(`/product/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.data && response.data.prices) {
                        await redisClient.set(pricesCacheKey, response.data.prices, config.cache.productDetailTtl);
                        logger.info('Product prices cached from API', { productId: id });
                        return this.paginatePrices(response.data.prices, page, limit);
                    } else {
                        throw ApiError.notFound('Product prices not found');
                    }
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        throw ApiError.unauthorized('Invalid or expired token');
                    }
                    throw error;
                }
            }

            return this.paginatePrices(cachedPrices, page, limit);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            logger.error('getProductPrices error', { error });
            throw ApiError.handleError(error, 'getProductPrices');
        }
    }

    paginatePrices(prices, page, limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPrices = prices.slice(startIndex, endIndex);
        
        return {
            prices: paginatedPrices,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(prices.length / limit),
                totalItems: prices.length,
                itemsPerPage: limit
            }
        };
    }
}

module.exports = new ProductPricesService(); 