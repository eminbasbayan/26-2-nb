const express = require('express');
const controller = require('../controllers/productController');
const validator = require('../validators/productValidator');
const { verifyToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/checkRole');

const router = express.Router();
router.get('/', controller.getAllProducts);
router.post('/', verifyToken, checkRole('admin'), validator.createProduct, controller.createProduct);
router.put('/:id', verifyToken, checkRole('admin'), validator.updateProduct, controller.updateProduct);
router.delete('/:productId', verifyToken, checkRole('admin'), validator.deleteProduct, controller.deleteProduct);

module.exports = router;
