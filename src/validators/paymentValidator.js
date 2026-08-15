const { body, param } = require('express-validator');
const validate = require('../middleware/validate.js');

const checkout = [
  body('productId')
    .notEmpty()
    .withMessage('productId zorunlu')
    .isMongoId()
    .withMessage('Geçersiz product id'),
  body('surname')
    .trim()
    .notEmpty()
    .withMessage('Soyad zorunlu')
    .isLength({ min: 2, max: 50 })
    .withMessage('Soyad 2-50 karakter olmalı'),
  body('identityNumber')
    .trim()
    .notEmpty()
    .withMessage('TCKN zorunlu')
    .isLength({ min: 11, max: 11 })
    .withMessage('TCKN 11 haneli olmalı')
    .isNumeric()
    .withMessage('TCKN sadece rakam olmalı'),
  body('gsmNumber')
    .trim()
    .notEmpty()
    .withMessage('Telefon zorunlu')
    .isLength({ min: 10, max: 20 })
    .withMessage('Telefon 10-20 karakter olmalı'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Adres zorunlu')
    .isLength({ min: 5, max: 255 })
    .withMessage('Adres 5-255 karakter olmalı'),
  validate,
];

const getOrder = [
  param('id').isMongoId().withMessage('Geçersiz order id'),
  validate,
];

module.exports = {
  checkout,
  getOrder,
};
