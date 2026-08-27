const { body, param } = require('express-validator');
const validate = require('../middleware/validate');

const checkout = [
  body('productId').isMongoId().withMessage('Geçersiz product id'),
  body('surname').trim().isLength({ min: 2, max: 50 }),
  body('identityNumber').trim().isLength({ min: 11, max: 11 }).isNumeric(),
  body('gsmNumber').trim().isLength({ min: 10, max: 20 }),
  body('address').trim().isLength({ min: 5, max: 255 }),
  validate,
];
const getOrder = [param('id').isMongoId().withMessage('Geçersiz order id'), validate];

module.exports = { checkout, getOrder };
