const express = require('express');
const { loadBooks, addBook, findBook, updateBook, deleteBook, } = require('./utils/books');
const pool = require('./db');

const app = express();
const port = 3000;

app.use(express.json());
app.param('id', (req, res, next, id) => {
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

app.get('/books', async(req, res) => {
  const books = await pool.query('SELECT * FROM books');

  return res.json({
    status: 'success',
    data: books.rows
  })
});

app.get('/books/:id', async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM books where id = $1`,
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
})

app.post('/books', async (req, res) => {
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
    return res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

app.delete('/books/:id', (req, res) => {
  try {
    const books = findBook(req.params.id)

    if (!books) {
      res.status(404).json({
        status: 'Not found',
        message: 'Data buku tidak ditemukan'
      })
    } else {
      deleteBook(req.params.id);
      res.status(201).json({
        status: 'success',
        message: 'Data buku berhasil dihapus'
      })
    }
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
})

app.patch('/books/:id', (req, res) => {
  try {
    const isPresent = findBook(req.params.id);
    const { id } = req.params;
    const newData = req.body;

      if (!isPresent) {
      res.status(404).json({
        status: 'Not found',
        message: 'Data buku tidak ditemukan'
      })
    } else {
      updateBook(id, newData);
      res.status(201).json({
        status: 'success',
        message: 'Data buku berhasil diubah'
      })
    }
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
})

app.listen(port, () =>
  console.log(`listening on port ${port}`)
);
