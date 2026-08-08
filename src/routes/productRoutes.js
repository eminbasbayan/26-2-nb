const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const productController = require('../controllers/productController.js');
const validate = require('../middleware/validate.js');

router.get('/', productController.getAllProducts);
router.post('/',
    [
        body('name').trim().notEmpty().withMessage('Name zorunlu'),
        body('price').isFloat({ gt: 0 }).withMessage('Price 0\'dan büyük olmalı'),
        body('description').trim().notEmpty().withMessage('Description zorunlu'),
        body('stock').optional().isInt({ min: 0 }).withMessage('Stock 0 veya daha büyük olmalı'),
        body('category').notEmpty().withMessage('Category zorunlu').isMongoId().withMessage('Geçersiz category id'),
    ],
    validate,
    productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);

module.exports = router;
