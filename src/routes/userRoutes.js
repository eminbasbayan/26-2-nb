const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController.js');
const { verifyToken } = require('../middleware/auth.js');

router.get('/', getAllUsers);
router.post('/', verifyToken, createUser);
router.put('/id', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;
