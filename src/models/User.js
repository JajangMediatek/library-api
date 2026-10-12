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

const getUsertWithRole = async (id) => {
  const query = `SELECT u.id, u.username, COALESCE(
                    array_agg(r.name) FILTER (WHERE r.id IS NOT NULL),
                    ARRAY[]::varchar[]
                  ) AS roles
                  FROM users u
                  LEFT JOIN user_roles ur ON ur.user_id = u.id
                  LEFT JOIN roles r ON r.id = ur.role_id
                  WHERE u.id = $1
                  GROUP BY u.id, u.username;`;

  const { rows } = await pool.query(query, [id])

  return rows[0]
}

module.exports = { createUser, findUserByIdentifier, getUsertWithRole };
