const express = require('express');
const router = express.Router();
const bookController = require('../controllers/books');
const { createBookValidation, updateBookValidation } = require('../validators/books');
const validate = require('../validators/validate');

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


router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.post('/', createBookValidation, validate, bookController.createBook);
router.patch('/:id', updateBookValidation, validate, bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports =  router;
