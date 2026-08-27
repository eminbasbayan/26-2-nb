const { body, param } = require('express-validator');
const validate = require('../middleware/validate');

const createProduct = [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('price').isFloat({ gt: 0 }),
  body('description').trim().isLength({ min: 5, max: 1000 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category').isMongoId(),
  validate,
];
const updateProduct = [
  param('id').isMongoId(),
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('price').optional().isFloat({ gt: 0 }),
  body('description').optional().trim().isLength({ min: 5, max: 1000 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category').optional().isMongoId(),
  validate,
];
const deleteProduct = [param('productId').isMongoId(), validate];

module.exports = { createProduct, updateProduct, deleteProduct };
