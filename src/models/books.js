const pool = require("../db");

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

module.exports = { getBookById }
