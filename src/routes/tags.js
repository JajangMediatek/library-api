const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tags');

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

router.get('/', tagController.getTags);

module.exports = router;
