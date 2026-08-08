const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const authValidator = require('../validators/authValidator.js');

router.post('/register', authValidator.register, authController.registerUser);
router.post('/login', authValidator.login, authController.loginUser);

module.exports = router;
