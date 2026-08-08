const { body, param } = require('express-validator');
const validate = require('../middleware/validate.js');

const createCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name zorunlu')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name 2-50 karakter olmalı'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description en fazla 500 karakter olmalı'),
  validate,
];

const updateCategory = [
  param('id').isMongoId().withMessage('Geçersiz category id'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name boş olamaz')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name 2-50 karakter olmalı'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description en fazla 500 karakter olmalı'),
  validate,
];

const deleteCategory = [
  param('categoryId').isMongoId().withMessage('Geçersiz category id'),
  validate,
];

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
};
