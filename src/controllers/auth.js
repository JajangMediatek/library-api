const { matchedData } = require("express-validator")
const userModel = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const login = async (req, res, next) => {
  try {
    const { identifier, password } = matchedData(req, { locations: ['body'] });

    const user = await userModel.findUserByIdentifier(identifier);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Username/email atau password salah'
      })
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET belum dikonfigurasi')
    }

    const token = jwt.sign(
      { sub: String(user.id) },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
        algorithm: 'HS256'
      }
    );

    const { password: _, ...safeUser } = user;

    res.status(200).json({
      status: 'success',
      message: 'berhasil login',
      data: {
        user: safeUser,
        token,
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { login };
