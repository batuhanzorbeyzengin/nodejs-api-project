const httpClient = require('../../helpers/http.helper');
const redisClient = require('../../helpers/redis.helper');
const logger = require('../../helpers/logger.helper');
const ApiError = require('../../helpers/error.helper');
const config = require('../../config');

class ProductDetailService {
    async execute(id, token) {
        try {
            if (!id) {
                throw ApiError.badRequest('Product ID is required');
            }

            if (!token) {
                throw ApiError.unauthorized('Authorization token is required');
            }

            const productCacheKey = redisClient.generateKey('product:detail', { id });
            const pricesCacheKey = redisClient.generateKey('product:prices', { id });

            const cachedProduct = await redisClient.get(productCacheKey);
            if (cachedProduct) {
                logger.info('Product detail retrieved from cache', { productId: id });
                return cachedProduct;
            }

            try {
                const response = await httpClient.get(`/product/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const { prices, ...productWithoutPrices } = response.data;

                await redisClient.set(productCacheKey, productWithoutPrices, config.cache.productDetailTtl);
                logger.info('Product detail cached', { productId: id });

                await redisClient.set(pricesCacheKey, prices, config.cache.productDetailTtl);
                logger.info('Product prices cached', { productId: id });

                return productWithoutPrices;
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
            logger.error('getProductById error', { error });
            throw ApiError.handleError(error, 'getProductById');
        }
    }
}

module.exports = new ProductDetailService(); 