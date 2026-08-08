const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController.js');
const categoryValidator = require('../validators/categoryValidator.js');

router.get('/', categoryController.getAllCategories);
router.post(
  '/',
  categoryValidator.createCategory,
  categoryController.createCategory,
);
router.put(
  '/:id',
  categoryValidator.updateCategory,
  categoryController.updateCategory,
);
router.delete(
  '/:categoryId',
  categoryValidator.deleteCategory,
  categoryController.deleteCategory,
);

module.exports = router;
