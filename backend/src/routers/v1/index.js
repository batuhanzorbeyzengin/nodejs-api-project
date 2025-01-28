const express = require('express');
const router = express.Router();
const productRouter = require('./product.router');
const ApiResponse = require('../../helpers/response.helper');

router.get('/', (req, res) => {
    res.json(
        ApiResponse.success('API v1 is running', {
            version: '1.0.0',
            environment: process.env.NODE_ENV
        })
    );
});

router.use('/product', productRouter);

module.exports = router;
