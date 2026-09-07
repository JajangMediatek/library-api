const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  console.log('VALIDATE:', errors.array());

  if (!errors.isEmpty()) {
    console.log('STOPPED AT VALIDATOR');

    return res.status(400).json({
      status: 'fail',
      errors: errors.array()
    });
  }

  console.log('VALIDATION PASSED');
  next();
};

module.exports = validate;
