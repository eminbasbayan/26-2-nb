const express = require('express');
const { param } = require('express-validator');
const controller = require('../controllers/productController');
const validate = require('../middleware/validate');

const router = express.Router();
const validId = [param('id').isMongoId(), validate];
router.get('/products/:id', validId, controller.getInternalProduct);
router.post('/products/:id/decrement-stock', validId, controller.decrementStock);

module.exports = router;
