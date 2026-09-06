const express = require('express');
const booksRouter = require('./routes/books');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/books', booksRouter);

app.listen(port, () =>
  console.log(`listening on port ${port}`)
);
