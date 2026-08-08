const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController.js');

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:categoryId', categoryController.deleteCategory);

module.exports = router;
