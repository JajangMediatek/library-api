const pool = require('../db.js');
const saltRounds = 10;
const bcrypt = require('bcrypt');


const createUser = async (data) => {
  const client = await pool.connect();
  const { password, username, email } = data;
  try {
    await client.query('BEGIN')
    const hash = await bcrypt.hash(password, saltRounds);

    const values = [username, email, hash];
    const query = `INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at, updated_at`
    const userResult = await client.query(query, values)
    const userId = userResult.rows[0].id;

    const roleQuery = 'INSERT INTO user_roles(user_id, role_id) VALUES($1, 2)';
    await client.query(roleQuery, [userId]);

    await client.query('COMMIT')
    return getUsertWithRoles(userId)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error;
  } finally {
    client.release()
  }
}

const findUserByIdentifier = async (identifier) => {
  const query = 'SELECT id, username, email, password FROM users WHERE username = $1 OR email = $1'

  const { rows } = await pool.query(query, [identifier]);

  return rows[0] ?? null;
}

const getUsertWithRoles = async (id) => {
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

module.exports = { createUser, findUserByIdentifier, getUsertWithRoles };
