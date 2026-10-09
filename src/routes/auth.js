const express = require('express');
const router = express.Router();
const authValidation = require('../validators/auth.js');
const authController = require('../controllers/auth.js');
const validate = require('../middlewares/validate.js');

router.post('/login', authValidation.login, validate, authController.login);

module.exports = router;
