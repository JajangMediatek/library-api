const express = require('express');
const booksRouter = require('./routes/books');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/books', booksRouter);
app.use(errorHandler
)
app.listen(port, () =>
  console.log(`listening on port ${port}`)
);
