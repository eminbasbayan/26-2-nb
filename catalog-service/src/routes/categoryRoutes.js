const express = require('express');
const controller = require('../controllers/categoryController');
const validator = require('../validators/categoryValidator');
const { verifyToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/checkRole');

const router = express.Router();
router.get('/', controller.getAllCategories);
router.post('/', verifyToken, checkRole('admin'), validator.createCategory, controller.createCategory);
router.put('/:id', verifyToken, checkRole('admin'), validator.updateCategory, controller.updateCategory);
router.delete('/:categoryId', verifyToken, checkRole('admin'), validator.deleteCategory, controller.deleteCategory);

module.exports = router;
