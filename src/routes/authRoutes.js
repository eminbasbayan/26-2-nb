const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const authValidator = require('../validators/authValidator.js');

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Yeni kullanıcı kaydı
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 50 }
 *               email: { type: string, format: email, maxLength: 255 }
 *               password: { type: string, minLength: 6, maxLength: 128 }
 *               city: { type: string, maxLength: 100 }
 *     responses:
 *       201:
 *         description: Kullanıcı oluşturuldu
 *       400:
 *         description: Validation veya kayıt hatası
 */
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

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Çıkış yap ve cookie'yi sil
 *     responses:
 *       200:
 *         description: Çıkış yapıldı
 */
router.post('/logout', authController.logoutUser);

module.exports = router;
