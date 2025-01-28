const productListService = require('./list.service');
const productDetailService = require('./detail.service');
const productCheckService = require('./check.service');
const productPricesService = require('./prices.service');

module.exports = {
    list: productListService,
    detail: productDetailService,
    check: productCheckService,
    prices: productPricesService
}; 