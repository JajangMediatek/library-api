const { matchedData } = require('express-validator')
const userModel = require('../models/User.js')

const createUser = async (req, res, next) => {
  const data = matchedData(req, { locations: ['body'] })
  try {
    const result = await userModel.createUser(data)

    return res.status(201).json({
      status: 'success',
      message: 'User berhasil dibuat',
      data: result
    })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: `username atau email telah digunakan`
      });
    }
    next(error)
  }
}

module.exports = { createUser };
