const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const authValidator = require('../validators/authValidator.js');

router.post('/register', authValidator.register, authController.registerUser);


/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Kullanıcı girişi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Giriş başarılı (accessToken cookie set edilir)
 *       401:
 *         description: Geçersiz email veya şifre
 */
router.post('/login', authValidator.login, authController.loginUser);


router.post('/logout', authController.logoutUser);

module.exports = router;
