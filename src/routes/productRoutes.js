const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const productValidator = require('../validators/productValidator.js');

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Tüm ürünleri listele
 *     responses:
 *       200:
 *         description: Ürün listesi (kategori populate edilmiş)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', productController.getAllProducts);

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Yeni ürün oluştur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, description, category]
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 100 }
 *               price: { type: number, exclusiveMinimum: 0 }
 *               description: { type: string, minLength: 5, maxLength: 1000 }
 *               stock: { type: integer, minimum: 0 }
 *               category: { type: string, description: Category ObjectId }
 *     responses:
 *       201:
 *         description: Ürün oluşturuldu
 *       400:
 *         description: Validation hatası
 *       404:
 *         description: Category not found
 */
router.post('/', productValidator.createProduct, productController.createProduct);

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Ürün güncelle
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
 *               name: { type: string, minLength: 2, maxLength: 100 }
 *               price: { type: number, exclusiveMinimum: 0 }
 *               description: { type: string, minLength: 5, maxLength: 1000 }
 *               stock: { type: integer, minimum: 0 }
 *               category: { type: string }
 *     responses:
 *       200:
 *         description: Ürün güncellendi
 *       404:
 *         description: Product veya Category bulunamadı
 */
router.put('/:id', productValidator.updateProduct, productController.updateProduct);

/**
 * @openapi
 * /api/products/{productId}:
 *   delete:
 *     tags: [Products]
 *     summary: Ürün sil
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Ürün silindi
 *       404:
 *         description: Product not found
 */
router.delete(
  '/:productId',
  productValidator.deleteProduct,
  productController.deleteProduct,
);

module.exports = router;
