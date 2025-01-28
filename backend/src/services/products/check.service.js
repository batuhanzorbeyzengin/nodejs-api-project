const httpClient = require('../../helpers/http.helper');
const ApiError = require('../../helpers/error.helper');
const logger = require('../../helpers/logger.helper');

class ProductCheckService {
    async execute(id, checkData, token, clientIp) {
        try {
            logger.info('Checking product eligibility', {
                productId: id,
                checkData,
                hasToken: !!token,
                clientIp
            });

            if (!id) {
                throw ApiError.badRequest('Product ID is required');
            }

            if (!checkData.currency || !checkData.price) {
                logger.warn('Missing required fields', { checkData });
                throw ApiError.badRequest('Currency and price are required');
            }

            if (!clientIp) {
                logger.warn('Missing client IP');
                throw ApiError.badRequest('Client IP is required');
            }

            const formattedIp = clientIp.replace('::ffff:', '').replace('::1', '34.123.123.123');

            const requestData = {
                currency: checkData.currency,
                price: checkData.price,
                buyer_ip: formattedIp
            };

            if (checkData.countryCode) {
                requestData.country_code = checkData.countryCode;
            }

            const response = await httpClient.post(`/product/${id}/check`, requestData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            logger.info('Product eligibility check successful', {
                productId: id,
                responseData: response
            });

            return response.data;
        } catch (error) {
            ApiError.handleError(error, 'checkProductEligibility', { id, checkData, clientIp });
        }
    }
}

module.exports = new ProductCheckService(); 