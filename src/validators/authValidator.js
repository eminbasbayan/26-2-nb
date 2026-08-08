const { body } = require('express-validator');
const validate = require('../middleware/validate.js');

const register = [
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

const login = [
  body('email')
    .isEmail()
    .withMessage('Geçerli bir email girin')
    .isLength({ max: 255 })
    .withMessage('Email en fazla 255 karakter olmalı'),
  body('password')
    .notEmpty()
    .withMessage('Password zorunlu')
    .isLength({ max: 128 })
    .withMessage('Password en fazla 128 karakter olmalı'),
  validate,
];

module.exports = {
  register,
  login,
};
