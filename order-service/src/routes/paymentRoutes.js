const express = require('express');
const controller = require('../controllers/paymentController');
const validator = require('../validators/paymentValidator');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
router.post('/checkout', verifyToken, validator.checkout, controller.checkout);
router.post('/callback', controller.callback);
router.get('/:id', verifyToken, validator.getOrder, controller.getOrder);

module.exports = router;
