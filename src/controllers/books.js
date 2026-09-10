const { matchedData } = require("express-validator");
const pool = require("../db");
const bookModel = require('../models/books');

const getBooks = async (req, res, next) => {
  try {
    const books = await bookModel.getBook();

    return res.json({
      status: 'success',
      data: books
    })
  } catch (err) {
    next(err)
  }
};

const getBookById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await bookModel.getBookById(id);

    if (!result) {
      return res.status(404).json({
        status: 'fail',
        message: 'Buku Tidak ditemukan'
      });
    }

    res.json({
      status: 'success',
      data : result
    });
  } catch (err) {
    next(err)
  }
}

const createBook = async (req, res, next) => {
  try {
    const {code, title, author, publisher, published_year, synopsis, total_copies, cover_url
    } = req.body;

    const result = await bookModel.createBook(code, title, author, publisher, published_year, synopsis, total_copies, cover_url);

    return res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: result
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: `kode buku '${req.body.code}' telah digunakan`
      });
    }
    next(error)
  }
}

const updateBook = async (req, res, next) => {
  const { id } = req.params;
  const updates = matchedData(req, {locations: ['body'] });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Tidak ada data valid untuk di-update.'
    });
  }
  try {
    const updateBook = await bookModel.updateBook(updates, id);

    if (!updateBook) {
      return res.status(404).json({
        status: 'fail',
        message: 'Buku tidak ditemukan'
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: updateBook,
    })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'kode buku yang dimasukkan sudah digunakan'
      })
    }
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  const {id} = req.params;
  try {
    const result = await bookModel.deleteBook(id);

    if (!result) {
      return res.status(404).json({
        status: 'fail',
        message: 'Buku tidak ditemukan'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
  } catch (error) {
    next(error)
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
