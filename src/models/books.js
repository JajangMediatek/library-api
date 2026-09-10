const pool = require("../db");

const getBook = async () => {
  const query = `SELECT
            books.*,
            json_agg(
                json_build_object(
                    'id', tags.id,
                    'name', tags.name
                )
            ) FILTER (WHERE tags.id IS NOT NULL) AS tags
        FROM books
        LEFT JOIN book_tags
            ON books.id = book_tags.book_id
        LEFT JOIN tags
            ON book_tags.tag_id = tags.id
        GROUP BY books.id;`;
  const { rows } = await pool.query(query);
  return rows;
}

const getBookById = async (id) => {
  const query = `SELECT
            books.*,
            json_agg(
                json_build_object(
                    'id', tags.id,
                    'name', tags.name
                )
            ) FILTER (WHERE tags.id IS NOT NULL) AS tags
        FROM books
        LEFT JOIN book_tags
            ON books.id = book_tags.book_id
        LEFT JOIN tags
            ON book_tags.tag_id = tags.id
        WHERE books.id = $1
        GROUP BY books.id;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0]
}

const createBook = async (code, title, author, publisher, published_year, synopsis, total_copies, cover_url) => {
  const query = `INSERT INTO books(
  code,
  title,
  author,
  publisher,
  published_year,
  synopsis,
  total_copies,
  cover_url)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING *;`;

  const { rows } = await pool.query(query, [code, title, author, publisher, published_year, synopsis, total_copies, cover_url]);
  return rows[0];
}

const updateBook = async (updates, id) => {
  const keys = Object.keys(updates);
  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

  const values = Object.values(updates);
  values.push(id);
  const idPosition = values.length;
  const query = `UPDATE books SET ${setClauses} WHERE id = $${idPosition} RETURNING *`;

  const { rows } = await pool.query(query, values);
  return rows[0];
}

const deleteBook = async (id) => {
  const query = 'DELETE FROM books where id = $1 RETURNING *';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = { getBookById, getBook, createBook, updateBook, deleteBook }
