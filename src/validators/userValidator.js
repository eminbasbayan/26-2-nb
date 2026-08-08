const { body, param } = require('express-validator');
const validate = require('../middleware/validate.js');

const createUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name zorunlu')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name 2-50 karakter olmalı'),
  body('email')
    .isEmail()
    .withMessage('Geçerli bir email girin')
    .isLength({ max: 255 })
    .withMessage('Email en fazla 255 karakter olmalı'),
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password 6-128 karakter olmalı'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City en fazla 100 karakter olmalı'),
  validate,
];

const updateUser = [
  param('id').isMongoId().withMessage('Geçersiz user id'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name boş olamaz')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name 2-50 karakter olmalı'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Geçerli bir email girin')
    .isLength({ max: 255 })
    .withMessage('Email en fazla 255 karakter olmalı'),
  body('password')
    .optional()
    .isLength({ min: 6, max: 128 })
    .withMessage('Password 6-128 karakter olmalı'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City en fazla 100 karakter olmalı'),
  validate,
];

const deleteUser = [
  param('userId').isMongoId().withMessage('Geçersiz user id'),
  validate,
];

module.exports = {
  createUser,
  updateUser,
  deleteUser,
};
