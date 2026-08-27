const express = require('express');
const controller = require('../controllers/authController');
const validator = require('../validators/authValidator');

const router = express.Router();
router.post('/register', validator.register, controller.registerUser);
router.post('/login', validator.login, controller.loginUser);
router.post('/logout', controller.logoutUser);

module.exports = router;
