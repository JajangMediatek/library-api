const pool = require('../db');

const getBookCopies = async (bookId) => {
  const query = `SELECT id, book_id, copy_code, condition, condition_notes, status
                  FROM book_copies WHERE book_id = $1 AND status = 'available'
                  RETURNING id, book_id, copy_code, condition, condition_notes, status`;

  const { rows } = await pool.query(query, [bookId]);

  return rows;
}

const createBookCopy = async (data) => {
  const client = await pool.connect();
  const { book_id } = data;
  try {
    await client.query('BEGIN');
    const checkBookStatusQuery = `SELECT id FROM books WHERE id = $1 AND is_active = TRUE`
    const checkBookStatusResult = await client.query(checkBookStatusQuery, [book_id]);

    if (checkBookStatusResult.rows.length === 0) {
      const error = new Error('Buku tidak ditemukan, Pastikan status buku aktif');
      error.code = "INVALID_BOOK_ID";
      throw error;
    }

    const query = `INSERT INTO book_copies(book_id, copy_code, condition, condition_notes, status) VALUES($1, $2, $3, $4, $5)
                  RETURNING id, book_id, copy_code, condition, condition_notes, status`
    const { rows } = await client.query(query, [
      data.book_id,
      data.copy_code,
      data.condition,
      data.condition_notes,
      data.status
    ]);

    await client.query('COMMIT');
    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

const updateBookCopy = async (data, id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const keys = Object.keys(data);
    const setClauses = keys.map((key, index) => `${key} = $${index + 1}`).join(',');
    const values = [...Object.values(data), id];
    const query = `UPDATE book_copies SET ${setClauses} WHERE id = $${values.length}
                    RETURNING id, book_id, copy_code, condition, condition_notes, status `;

    const { rows } = await client.query(query, values);

    if (rows.length === 0) {
      const error = new Error('Gagal memperbarui data eksampelar buku');
      error.code = 'FAILED_TO_UPD_COPY'
      throw error;
    }

    await client.query('COMMIT');
    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { getBookCopies, createBookCopy, updateBookCopy };
