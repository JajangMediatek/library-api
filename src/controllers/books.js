const pool = require("../db");

const getBooks = async (req, res, next) => {
  try {
    const books = await pool.query('SELECT * FROM books');

    return res.json({
      status: 'success',
      data: books.rows
    })
  } catch (err) {
    next(err)
  }
};

const getBookById = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM books where id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Buku Tidak ditemukan'
      });
    }

    res.json({
      status: 'success',
      data : result.rows[0]
    });
  } catch (err) {
    next(err)
  }
}

const createBook = async (req, res, next) => {
  try {
    const {code, title, author, publisher, published_year, synopsis, total_copies, cover_url
    } = req.body;
    const result = await pool.query(`INSERT INTO books(
    code,
    title,
    author,
    publisher,
    published_year,
    synopsis,
    total_copies,
    cover_url)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;`,
    [code, title, author, publisher, published_year, synopsis, total_copies, cover_url]);

    return res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: result.rows[0]
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
  const updates = req.body;

  const keys = Object.keys(updates);

  if (keys.length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'tidak ada data yang dikirim untuk diperbarui.'
    })
  }

  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
  const values = Object.values(updates);
  values.push(id);
  const idPosition = values.length;

  const query = `UPDATE books SET ${setClauses.join(',')} WHERE id = $${idPosition} RETURNING *`;
  console.log(query)
  try {
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Buku tidak ditemukan'
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: rows[0],
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
    const { rows } = await pool.query('DELETE FROM books where id = $1 RETURNING *', [id]);

    if (rows.length === 0) {
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
