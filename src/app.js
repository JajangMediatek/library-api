const express = require('express');
const authRouter = require('./routes/auth.js');
const booksRouter = require('./routes/books');
const tagsRouter = require('./routes/tags');
const userRouter = require('./routes/users');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/auth', authRouter);
app.use('/books', booksRouter);
app.use('/tags', tagsRouter);
app.use('/users', userRouter);
app.use(errorHandler)
app.listen(port, () =>
  console.log(`listening on port ${port}`)
);
