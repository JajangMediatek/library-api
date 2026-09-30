const pool = require('../db');

const getTags = async (req, res) => {
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
  const query = 'INSERT INTO tags(name) VALUES($1) RETURNING *;'

  const { rows } = await pool.query(query, [name]);
  return rows[0];
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
  const query = 'DELETE FROM tags where id =$1 RETURNING *';

  const { rows } = await pool.query(query, [id])
  return rows[0];
}

module.exports = { getTags, getTagsById, createTag, updateTag, deleteTag }
