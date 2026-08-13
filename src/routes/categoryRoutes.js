const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController.js');
const categoryValidator = require('../validators/categoryValidator.js');
const { verifyToken } = require('../middleware/auth.js');
const { checkRole } = require('../middleware/checkRole.js');

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Tüm kategorileri listele
 *     responses:
 *       200:
 *         description: Kategori listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', categoryController.getAllCategories);

/**
 * @openapi
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Yeni kategori oluştur (admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 50 }
 *               description: { type: string, maxLength: 500 }
 *     responses:
 *       201:
 *         description: Kategori oluşturuldu
 *       400:
 *         description: Validation veya unique name hatası
 *       403:
 *         description: Token gerekli veya yetkisiz
 */
router.post(
  '/',
  verifyToken,
  checkRole('admin'),
  categoryValidator.createCategory,
  categoryController.createCategory,
);

/**
 * @openapi
 * /api/categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Kategori güncelle (admin)
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
 *               description: { type: string, maxLength: 500 }
 *     responses:
 *       200:
 *         description: Kategori güncellendi
 *       403:
 *         description: Token gerekli veya yetkisiz
 *       404:
 *         description: Category not found
 */
router.put(
  '/:id',
  verifyToken,
  checkRole('admin'),
  categoryValidator.updateCategory,
  categoryController.updateCategory,
);

/**
 * @openapi
 * /api/categories/{categoryId}:
 *   delete:
 *     tags: [Categories]
 *     summary: Kategori sil (admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Kategori silindi
 *       403:
 *         description: Token gerekli veya yetkisiz
 *       404:
 *         description: Category not found
 */
router.delete(
  '/:categoryId',
  verifyToken,
  checkRole('admin'),
  categoryValidator.deleteCategory,
  categoryController.deleteCategory,
);

module.exports = router;
