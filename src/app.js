const express = require('express');
const booksRouter = require('./routes/books');

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

app.use('/books', booksRouter);

app.listen(port, () =>
  console.log(`listening on port ${port}`)
);
