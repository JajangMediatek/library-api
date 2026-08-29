const express = require('express');
const { loadBooks, addBook, findBook, updateBook, deleteBook, } = require('./utils/books');

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
})

app.get('/books', (req, res) => {
  const books = loadBooks();
  res.json(books)
});

app.get('/books/:id', (req, res) => {
  const book = findBook(req.params.id)
  console.log(book)
  res.json(book);
})

app.post('/books', (req, res) => {
  try {
    const createdBook = addBook(req.body);

    return res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: createdBook
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
