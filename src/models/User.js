const pool = require('../db.js');
const saltRounds = 10;
const bcrypt = require('bcrypt');


const createUser = async (data) => {
  const { password, ...newdata } = data;
  const hash = await bcrypt.hash(password, saltRounds);

  const values = [...Object.values(newdata), hash];
  const query = `INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at, updated_at`
  const { rows } = await pool.query(query, values)

  return rows;
}

module.exports = { createUser };
