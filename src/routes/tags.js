const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tags');
const { createTagValidation, updateTagValidation } = require('../validators/tags');
const validate = require('../middleware/validate');

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
router.get('/:id', tagController.getTagById);
router.post('/', createTagValidation, validate, tagController.createTag);
router.patch('/:id', updateTagValidation, validate, tagController.updateTag);
router.delete('/:id', tagController.deleteTag);

module.exports = router;
