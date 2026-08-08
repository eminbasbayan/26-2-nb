const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const productValidator = require('../validators/productValidator.js');

router.get('/', productController.getAllProducts);
router.post('/', productValidator.createProduct, productController.createProduct);
router.put('/:id', productValidator.updateProduct, productController.updateProduct);
router.delete(
  '/:productId',
  productValidator.deleteProduct,
  productController.deleteProduct,
);

module.exports = router;
