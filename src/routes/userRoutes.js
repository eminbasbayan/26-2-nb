const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
} = require('../controllers/userController.js');

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/', updateUser);
router.delete('/:userId', deleteUser);

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
