const pool = require("../db");

const getTags = async (req, res, next) => {
  try {
    const tags = await pool.query('SELECT * FROM tags;');

    return res.status(200).json({
      status: 'success',
      data: tags.rows
    })
  } catch (error) {
    next(error)
  }
};

const getTagById = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM tags WHERE id = $1;',
      [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tags Tidak Ditemukan'
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    })
  } catch (error) {
    next(error)
  }
};

const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;

    const result = await pool.query('INSERT INTO tags(name) VALUES($1) RETURNING *;', [name]);

    return res.status(200).json({
      status: 'success',
      data: result.rows[0]
    })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: `tag dengan nama '${req.body.name}' sudah ada`
      });
    }
    next(error)
  }
};

const updateTag = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const keys = Object.keys(updates);

  if (keys.length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'tidak ada data yang dikirim untuk diperbarui.'
    })
  }

  const values = Object.values(updates);
  values.push(id);
  const idPosition = values.length;

  const query = `UPDATE tags SET name=$1 WHERE id = $${idPosition} RETURNING *`;
  try {
    const { rows } = await pool.query(query, values)

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tag tidak ditemukan'
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Tag berhasil diperbarui',
      data: rows[0],
    })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: `tag dengan nama '${req.body.name}' sudah ada`
      })
    }
    next(error)
  }
};

const deleteTag = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM tags where id =$1 RETURNING *', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tag tidak ditemukan'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Tag berhasil dihapus'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getTags, getTagById, createTag, updateTag, deleteTag };
