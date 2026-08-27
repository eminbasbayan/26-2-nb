const { request } = require('./httpClient');

const baseUrl = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002';

const getProduct = (productId) =>
  request(baseUrl, `/internal/products/${encodeURIComponent(productId)}`);

const decrementStock = (productId) =>
  request(baseUrl, `/internal/products/${encodeURIComponent(productId)}/decrement-stock`, {
    method: 'POST',
  });

module.exports = { getProduct, decrementStock };
