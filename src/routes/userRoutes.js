const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController.js');

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;
