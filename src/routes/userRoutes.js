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

router.get('/', getAllUsers);
router.post('/', verifyToken, userValidator.createUser, createUser);
router.put('/:id', userValidator.updateUser, updateUser);
router.delete('/:userId', userValidator.deleteUser, deleteUser);

module.exports = router;
