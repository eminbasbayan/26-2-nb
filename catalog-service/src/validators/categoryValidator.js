const { body, param } = require('express-validator');
const validate = require('../middleware/validate');

const createCategory = [
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('description').optional().trim().isLength({ max: 500 }),
  validate,
];
const updateCategory = [
  param('id').isMongoId(),
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('description').optional().trim().isLength({ max: 500 }),
  validate,
];
const deleteCategory = [param('categoryId').isMongoId(), validate];

module.exports = { createCategory, updateCategory, deleteCategory };
