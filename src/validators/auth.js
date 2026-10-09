const { checkExact, checkSchema } = require("express-validator");

const login = checkExact(checkSchema({
  identifier: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field username/email harus berupa string')
        }
        return true;
      }
    },
    notEmpty: {
      errorMessage: 'username/email wajib diisi'
    }
  },
  password: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field password harus berupa string')
        }
        return true;
      }
    },
    notEmpty: {
      errorMessage: 'password wajib diisi'
    }
  }
}), {
  message: 'Terdapat field yang tidak diizinkan',
  locations: ['body']
})

module.exports = { login };
