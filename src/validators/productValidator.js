const { body, param } = require('express-validator');
const validate = require('../middleware/validate.js');

const createProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name zorunlu')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name 2-100 karakter olmalı'),
  body('price').isFloat({ gt: 0 }).withMessage("Price 0'dan büyük olmalı"),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description zorunlu')
    .isLength({ min: 5, max: 1000 })
    .withMessage('Description 5-1000 karakter olmalı'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock 0 veya daha büyük olmalı'),
  body('category')
    .notEmpty()
    .withMessage('Category zorunlu')
    .isMongoId()
    .withMessage('Geçersiz category id'),
  validate,
];

const updateProduct = [
  param('id').isMongoId().withMessage('Geçersiz product id'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name boş olamaz')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name 2-100 karakter olmalı'),
  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price 0'dan büyük olmalı"),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description boş olamaz')
    .isLength({ min: 5, max: 1000 })
    .withMessage('Description 5-1000 karakter olmalı'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock 0 veya daha büyük olmalı'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Geçersiz category id'),
  validate,
];

const deleteProduct = [
  param('productId').isMongoId().withMessage('Geçersiz product id'),
  validate,
];

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
};
