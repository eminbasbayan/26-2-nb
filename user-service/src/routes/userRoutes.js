const express = require('express');
const controller = require('../controllers/userController');
const validator = require('../validators/userValidator');
const { verifyToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/checkRole');

const router = express.Router();
router.get('/', verifyToken, checkRole('admin', 'user'), controller.getAllUsers);
router.post('/', verifyToken, checkRole('admin'), validator.createUser, controller.createUser);
router.put('/:id', verifyToken, checkRole('admin'), validator.updateUser, controller.updateUser);
router.delete('/:userId', verifyToken, checkRole('admin'), validator.deleteUser, controller.deleteUser);

module.exports = router;
