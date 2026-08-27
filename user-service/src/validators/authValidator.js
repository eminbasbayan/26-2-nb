const { body } = require('express-validator');
const validate = require('../middleware/validate');

const register = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name 2-50 karakter olmalı'),
  body('email').isEmail().withMessage('Geçerli bir email girin').isLength({ max: 255 }),
  body('password').isLength({ min: 6, max: 128 }).withMessage('Password 6-128 karakter olmalı'),
  body('city').optional().trim().isLength({ max: 100 }),
  validate,
];

const login = [
  body('email').isEmail().withMessage('Geçerli bir email girin'),
  body('password').notEmpty().withMessage('Password zorunlu').isLength({ max: 128 }),
  validate,
];

module.exports = { register, login };
