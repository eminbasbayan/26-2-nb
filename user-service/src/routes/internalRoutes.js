const express = require('express');
const { param } = require('express-validator');
const { getInternalUser } = require('../controllers/userController');
const validate = require('../middleware/validate');

const router = express.Router();
router.get('/users/:id', param('id').isMongoId(), validate, getInternalUser);

module.exports = router;
