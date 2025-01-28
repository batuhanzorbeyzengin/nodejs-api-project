const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const validateBearerToken = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const productSchemas = require('../../helpers/validations/product.validation');

router.use(validateBearerToken);

router.get('/', productController.getProducts);

router.get('/:id', productController.getProductById);

router.get('/:id/prices', productController.getProductPrices);

router.post('/:id/check',
    validate(productSchemas.checkEligibility, 'body'),
    productController.checkProductEligibility
);

module.exports = router;