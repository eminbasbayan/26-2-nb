const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController.js');
const { verifyToken } = require('../middleware/auth.js');
const { checkRole } = require('../middleware/checkRole.js');
const userValidator = require('../validators/userValidator.js');

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Tüm kullanıcıları listele (admin)
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
 *         description: Token gerekli veya yetkisiz
 */
router.get('/', verifyToken, checkRole('admin', 'user'), getAllUsers);

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Yeni kullanıcı oluştur (admin)
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
 *               role: { type: string, enum: [user, admin] }
 *     responses:
 *       201:
 *         description: Kullanıcı oluşturuldu
 *       400:
 *         description: Validation hatası
 *       403:
 *         description: Token gerekli veya yetkisiz
 */
router.post(
  '/',
  verifyToken,
  checkRole('admin'),
  userValidator.createUser,
  createUser,
);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Kullanıcı güncelle (admin)
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
 *               role: { type: string, enum: [user, admin] }
 *     responses:
 *       200:
 *         description: Kullanıcı güncellendi
 *       404:
 *         description: Kullanıcı bulunamadı
 *       403:
 *         description: Token gerekli veya yetkisiz
 */
router.put(
  '/:id',
  verifyToken,
  checkRole('admin'),
  userValidator.updateUser,
  updateUser,
);

/**
 * @openapi
 * /api/users/{userId}:
 *   delete:
 *     tags: [Users]
 *     summary: Kullanıcı sil (admin)
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
 *         description: Token gerekli veya yetkisiz
 */
router.delete(
  '/:userId',
  verifyToken,
  checkRole('admin'),
  userValidator.deleteUser,
  deleteUser,
);

module.exports = router;
