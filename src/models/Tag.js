const pool = require('../db');

const getTags = async () => {
  const query = 'SELECT * FROM tags;';

  const { rows } = await pool.query(query);
  return rows
}

const getTagsById = async (id) => {
  const query = 'SELECT * FROM tags WHERE id = $1;';

  const { rows } = await pool.query(query, [id])
  return rows[0]
}

const createTag = async (name) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN')

    const checkQuery = `SELECT id FROM tags WHERE LOWER(name) = LOWER($1) AND is_active = FALSE LIMIT 1`
    const checkResult = await client.query(checkQuery, [name])

    if (checkResult.rows.length > 0) {
      const tagId = checkResult.rows[0].id;
      const updatQuery = `UPDATE tags SET is_active = TRUE WHERE id = $1 RETURNING id, name`

      const updateResult = await client.query(updatQuery, [tagId]);

      await client.query('COMMIT')
      return updateResult.rows[0];
    }

    const insertQuery = `INSERT INTO tags (name) VALUES ($1) RETURNING id, name`
    const insertResult = await client.query(insertQuery, [name]);

    await client.query('COMMIT');
    return insertResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

const updateTag = async (id, updates) => {
  const values = Object.values(updates);
  values.push(id);
  const idPosition = values.length;

  const query = `UPDATE tags SET name=$1 WHERE id = $${idPosition} RETURNING *`;
  const { rows } = await pool.query(query, values)

  return rows[0];
}

const deleteTag = async (id) => {
  const query = 'UPDATE tags SET is_active = FALSE WHERE id = $1 AND is_active = TRUE RETURNING id, name, is_active';

  const { rows } = await pool.query(query, [id])
  return rows[0];
}

const getInvalidTags = async (tagIds, db = pool) => {
  if (tagIds.length === 0) {
    return [];
  }
  const query = `SELECT id FROM tags WHERE id = ANY($1::integer[]) AND is_active = TRUE`

  const { rows } = await db.query(query, [tagIds]);
  const activeIds = new Set(rows.map((row) => row.id));
  return tagIds.filter((id) => !activeIds.has(id));
}

module.exports = { getTags, getTagsById, createTag, updateTag, deleteTag, getInvalidTags }
