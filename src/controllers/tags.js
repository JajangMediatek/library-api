const pool = require("../db");

const getTags = async (req, res) => {
  try {
    const tags = await pool.query('SELECT * FROM tags');

    return res.status(200).json({
      status: 'success',
      data: tags.rows
    })
  } catch (error) {
    next(error)
  }
};

module.exports = {getTags};
