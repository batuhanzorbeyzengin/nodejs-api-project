const products = require('../services/products');
const ApiResponse = require('../helpers/response.helper');
const logger = require('../helpers/logger.helper');

class ProductController {
    async getProducts(req, res, next) {
        try {
            const offset = parseInt(req.query.offset) || 0;
            const limit = parseInt(req.query.limit) || 50;
            const token = req.token;

            const { products: productList, total } = await products.list.execute(offset, limit, token);

            return res.json(
                ApiResponse.paginate(
                    productList,
                    Math.floor(offset / limit) + 1,
                    limit,
                    total
                )
            );
        } catch (error) {
            return res.status(error.statusCode || 500).json(
                ApiResponse.error(error)
            );
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const token = req.token;

            const product = await products.detail.execute(id, token);

            return res.json(
                ApiResponse.success('Product details retrieved successfully.', product)
            );
        } catch (error) {
            return res.status(error.statusCode || 500).json(
                ApiResponse.error(error)
            );
        }
    }

    async getProductPrices(req, res) {
        try {
            const { id } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const token = req.token;

            const pricesData = await products.prices.execute(id, page, limit, token);

            return res.json(
                ApiResponse.success('Product prices retrieved successfully.', pricesData)
            );
        } catch (error) {
            return res.status(error.statusCode || 500).json(
                ApiResponse.error(error)
            );
        }
    }

    async checkProductEligibility(req, res) {
        try {
            const { id } = req.params;
            const token = req.token;

            const checkData = {
                countryCode: req.body.countryCode,
                currency: req.body.currency,
                price: req.body.price
            };

            const eligibilityData = await products.check.execute(id, checkData, token, req.clientIp);

            return res.json(
                ApiResponse.success('Product eligibility check completed successfully.', eligibilityData)
            );
        } catch (error) {
            return res.status(error.statusCode || 500).json(
                ApiResponse.error(error)
            );
        }
    }
}

module.exports = new ProductController(); 