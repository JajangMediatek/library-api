const express = require('express');
const userController = require('../controllers/users.js');
const validate = require('../middlewares/validate.js');
const { createUserValidation } = require('../validators/users.js');
const authenticate = require('../middlewares/authenticate.js');
const authorize = require('../middlewares/authorize.js');
const router = express.Router();

router.param('id', (req, res, next, id) => {
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({
      status: 'fail',
      message: 'id harus berupa angka'
    });
  }

  req.params.id = numericId;
  next();
});


router.post('/', authenticate, authorize('admin'), createUserValidation, validate, userController.createUser)

module.exports = router;
