const pool = require("../db");
const { getInvalidTags } = require("./Tag");

const getBooks = async () => {
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
            ON book_tags.tag_id = tags.id AND tags.is_active = TRUE
        WHERE books.is_active = true
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
        WHERE books.id = $1 AND books.is_active = TRUE
        GROUP BY books.id;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0]
}

const createBook = async (data) => {
  const { tag_ids = [], ...bookData } = data;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const invalidIds = await getInvalidTags(tag_ids, client);
    if (invalidIds.length > 0) {
      const error = new Error('Terdapat tag yang tidak valid atau tidak aktif');
      error.code = 'INVALID_TAG_IDS';
      error.invalidIds = invalidIds;
      throw error;
    }

    const insertBookQuery = `INSERT INTO books(code, title, author, publisher, published_year, synopsis, total_copies, cover_url) values($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;
    const bookParams = [
      bookData.code,
      bookData.title,
      bookData.author,
      bookData.publisher,
      bookData.published_year,
      bookData.synopsis,
      bookData.total_copies,
      bookData.cover_url
    ];

    const bookResult = await client.query(insertBookQuery, bookParams);
    const bookId = bookResult.rows[0].id;

    if (tag_ids.length > 0) {
      const values = tag_ids.map((_, index) => `($1, $${index + 2})`).join(', ');
      const insertTagsQuery = `INSERT INTO book_tags(book_id, tag_id) VALUES ${values}`;
      const tagParams = [bookId, ...tag_ids];

      await client.query(insertTagsQuery, tagParams);
    }

    await client.query('COMMIT')
    return await getBookById(bookId);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateBook = async (updates, id) => {
  const { tag_ids, ...bookData } = updates;
  const client = await pool.connect();

  try {
    await client.query('BEGIN')

    const invalidIds = await getInvalidTags(tag_ids, client);
    if (invalidIds.length > 0) {
      const error = new Error('Terdapat tag yang tidak valid atau tidak aktif');
      error.code = 'INVALID_TAG_IDS';
      error.invalidIds = invalidIds;
      throw error;
    }

    const keys = Object.keys(bookData);
    if (keys.length > 0) {
      const setClauses = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = [...Object.values(bookData), id];
      const query = `UPDATE books SET ${setClauses} WHERE id = $${values.length} RETURNING *`;

      const { rows } = await client.query(query, values);

      if (rows.length === 0) {
        return null;
      }
    }
    if (tag_ids !== undefined) {
      await client.query('DELETE FROM book_tags WHERE book_id = $1', [id])
      if (Array.isArray(tag_ids) && tag_ids.length > 0) {

        const values = tag_ids.map((_, index) => `($1, $${index + 2})`).join(', ');
        const tagQuery = `INSERT INTO book_tags(book_id, tag_id) VALUES${values}`;
        const tagParams = [id, ...tag_ids]
        await client.query(tagQuery, tagParams);
      }

    }

    await client.query('COMMIT')
    return getBookById(id)
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

const deleteBook = async (id) => {
  const query = 'UPDATE books SET is_active = FALSE where id = $1 AND is_active = TRUE RETURNING id, code, title, is_active';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = { getBookById, getBooks, createBook, updateBook, deleteBook }
