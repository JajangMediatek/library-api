const express = require('express');
const router = express.Router();
const BookCopyController = require('../controllers/book_copies.js');
const { createBookCopyValidation, updateBookCopyValidation } = require('../validators/book_copies.js');
const validate = require('../middlewares/validate.js');
const authenticate = require('../middlewares/authenticate.js');
const authorize = require('../middlewares/authorize.js');


router.get('/', BookCopyController.getBookCopies);
router.post('/', authenticate, authorize('admin'), createBookCopyValidation, validate, BookCopyController.createBookCopy);
router.patch('/:id', authenticate, authorize('admin'), updateBookCopyValidation, validate, BookCopyController.updateBookCopy);

module.exports = router;
