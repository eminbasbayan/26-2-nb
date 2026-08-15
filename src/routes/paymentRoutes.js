const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController.js');
const paymentValidator = require('../validators/paymentValidator.js');
const { verifyToken } = require('../middleware/auth.js');

/**
 * @openapi
 * /api/payments/checkout:
 *   post:
 *     tags: [Payments]
 *     summary: Ürün için Iyzico Checkout Form başlat
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, surname, identityNumber, gsmNumber, address]
 *             properties:
 *               productId: { type: string }
 *               surname: { type: string, minLength: 2, maxLength: 50 }
 *               identityNumber: { type: string, minLength: 11, maxLength: 11 }
 *               gsmNumber: { type: string }
 *               address: { type: string, minLength: 5, maxLength: 255 }
 *     responses:
 *       200:
 *         description: paymentPageUrl ile Iyzico formuna yönlendir
 *       400:
 *         description: Stok yok veya form başlatılamadı
 *       404:
 *         description: Ürün veya kullanıcı bulunamadı
 */
router.post(
  '/checkout',
  verifyToken,
  paymentValidator.checkout,
  paymentController.checkout,
);

/**
 * @openapi
 * /api/payments/callback:
 *   post:
 *     tags: [Payments]
 *     summary: Iyzico ödeme sonucu callback (Iyzico çağırır)
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               token: { type: string }
 *     responses:
 *       302:
 *         description: Frontend success/fail sayfasına yönlendirir
 */
router.post('/callback', paymentController.callback);

/**
 * @openapi
 * /api/payments/{id}:
 *   get:
 *     tags: [Payments]
 *     summary: Sipariş detayı
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Sipariş
 *       403:
 *         description: Yetkisiz
 *       404:
 *         description: Sipariş bulunamadı
 */
router.get(
  '/:id',
  verifyToken,
  paymentValidator.getOrder,
  paymentController.getOrder,
);

module.exports = router;
