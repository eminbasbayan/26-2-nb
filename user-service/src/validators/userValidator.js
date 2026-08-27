const { body, param } = require('express-validator');
const validate = require('../middleware/validate');

const userFields = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().isLength({ max: 255 }),
  body('password').optional().isLength({ min: 6, max: 128 }),
  body('city').optional().trim().isLength({ max: 100 }),
  body('role').optional().isIn(['user', 'admin']),
];

const createUser = [
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('email').isEmail().isLength({ max: 255 }),
  body('password').isLength({ min: 6, max: 128 }),
  body('city').optional().trim().isLength({ max: 100 }),
  body('role').optional().isIn(['user', 'admin']),
  validate,
];

const updateUser = [param('id').isMongoId(), ...userFields, validate];
const deleteUser = [param('userId').isMongoId(), validate];

module.exports = { createUser, updateUser, deleteUser };
