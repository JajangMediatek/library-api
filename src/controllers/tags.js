const pool = require("../db");
const tagModel = require("../models/tags.js")

const getTags = async (req, res, next) => {
  try {
    const tags = await tagModel.getTags();

    return res.status(200).json({
      status: 'success',
      data: tags
    })
  } catch (error) {
    next(error)
  }
};

const getTagById = async (req, res, next) => {
  try {
    const result = await tagModel.getTagsById(req.params.id)

    if (!result) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tags Tidak Ditemukan'
      });
    }

    res.status(200).json({
      status: 'success',
      data: result
    })
  } catch (error) {
    next(error)
  }
};

const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;

    const result = await tagModel.createTag(name);

    return res.status(200).json({
      status: 'success',
      data: result
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

  try {
    const result = await tagModel.updateTag(id, updates)

    if (!result) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tag tidak ditemukan'
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Tag berhasil diperbarui',
      data: result,
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
    const result = await tagModel.deleteTag(id);
    if (!result) {
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
