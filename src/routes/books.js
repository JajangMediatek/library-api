const express = require('express');
const router = express.Router();
const bookController = require('../controllers/books');
const { createBookValidation, updateBookValidation } = require('../validators/books');
const validate = require('../validators/validate');


router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.post('/', createBookValidation, validate, bookController.createBook);
router.patch('/:id', updateBookValidation, validate, bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports =  router;
