const fs = require("fs");

// membuat folder data jika belum ada
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath)
}

// membuat file data jika belum anda
const dataPath = './data/books.json'
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]', "utf-8")
}

// timpa data buku
const saveBooks = (books) => {
  fs.writeFileSync('./data/books.json', JSON.stringify(books))
}

// cari id yang tersedia
const generateNextId = (books) => {
  let id = 1;
  while (books.some((book) => book.id === id)) {
    id++
  }
  return id;
};

// ambil semua data buku
const loadBooks = () => {
  const file = fs.readFileSync("data/books.json", "utf-8");
  const books = JSON.parse(file);
  return books
}

// cari data buku berdasarkan id
const findBook = (id) => {
  const books = loadBooks()
  const book = books.find(
    (book) => book.id === id);
  return book;
}

// simpan data buku
const addBook = (book) => {
  const books = loadBooks();

  const newBook = {
     ...book,
    id: generateNextId(books)
  };

  books.push(newBook);
  saveBooks(books)
  return newBook;
}

// hapus data buku
const deleteBook = (id) => {
  const books = loadBooks();
  const filteredBooks = books.filter((book) =>  book.id !== id);
  saveBooks(filteredBooks);
}

// ubah data buku
const updateBook = (id, newData) => {
  const books = loadBooks();

  const index = books.findIndex((book) => book.id === id);
  books[index] = {
    ...books[index],
    ...newData
  }
  saveBooks(books);
  return books[index];
}


module.exports = { loadBooks, addBook, deleteBook, updateBook, findBook };
