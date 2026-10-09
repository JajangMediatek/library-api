const pool = require('../db.js');
const saltRounds = 10;
const bcrypt = require('bcrypt');


const createUser = async (data) => {
  const { password, username, email } = data;

  const hash = await bcrypt.hash(password, saltRounds);

  const values = [username, email, hash];
  const query = `INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at, updated_at`
  const { rows } = await pool.query(query, values)

  return rows[0];
}

const findUserByIdentifier = async (identifier) => {
  const query = 'SELECT id, username, email, password FROM users WHERE username = $1 OR email = $1'

  const { rows } = await pool.query(query, [identifier]);

  return rows[0] ?? null;
}


module.exports = { createUser, findUserByIdentifier };
