const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController.js');
const { verifyToken } = require('../middleware/auth.js');
const userValidator = require('../validators/userValidator.js');

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Tüm kullanıcıları listele
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Token gerekli
 */
router.get('/', verifyToken, getAllUsers);

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Yeni kullanıcı oluştur
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
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
 *         description: Validation hatası
 *       403:
 *         description: Token gerekli
 */
router.post('/', verifyToken, userValidator.createUser, createUser);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Kullanıcı güncelle
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 50 }
 *               email: { type: string, format: email, maxLength: 255 }
 *               password: { type: string, minLength: 6, maxLength: 128 }
 *               city: { type: string, maxLength: 100 }
 *     responses:
 *       200:
 *         description: Kullanıcı güncellendi
 *       404:
 *         description: Kullanıcı bulunamadı
 *       403:
 *         description: Token gerekli
 */
router.put('/:id', verifyToken, userValidator.updateUser, updateUser);

/**
 * @openapi
 * /api/users/{userId}:
 *   delete:
 *     tags: [Users]
 *     summary: Kullanıcı sil
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Kullanıcı silindi
 *       404:
 *         description: Kullanıcı bulunamadı
 *       403:
 *         description: Token gerekli
 */
router.delete('/:userId', verifyToken, userValidator.deleteUser, deleteUser);

module.exports = router;
