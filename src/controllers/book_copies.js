const { matchedData } = require('express-validator');
const bookCopyModel = require('../models/BookCopy.js');


const getBookCopies = async (req, res, next) => {
  try {
    const bookCopies = await bookCopyModel.getBookCopies();

    return res.status(200).json({
      status: "success",
      message: "data salinan buku berhasil ditampilkan",
      data: bookCopies
    })

  } catch (error) {
    next(error)
  }
}

const createBookCopy = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ['body'] });
    const result = await bookCopyModel.createBookCopy(data)

    return res.status(200).json({
      status: 'success',
      message: 'Salinan Buku berhasil dibuat',
      data: result
    })

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: `kode salinan buku '${req.body.copy_code}' telah digunakan`
      });
    }
    if (error.code === 'INVALID_BOOK_ID') {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      })
    }
    next(error)
  }
}

const updateBookCopy = async (req, res, next) => {
  const { id } = req.params;
  const updates = matchedData(req, { locations: ['body'] });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Tidak ada data valid untuk di-update.'
    });
  }

  try {
    const result = await bookCopyModel.updateBookCopy(updates, id);

    return res.status(200).json({
      status: 'success',
      message: 'Salinan buku berhasil di-update',
      data: result
    })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'kode buku yang dimasukkan sudah digunakan'
      })
    }
    if (error.code === 'FAILED_TO_UPD_COPY') {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
    next(error)
  }
}

module.exports = { getBookCopies, createBookCopy, updateBookCopy };
