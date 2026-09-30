const { checkExact, checkSchema } = require("express-validator");


const createUserValidation = checkExact(checkSchema({
  username: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field username harus berupa string')
        }
        return true;
      }
    },
    trim: true,
    notEmpty: {
      errorMessage: 'Field username wajib diisi'
    },
  },
  email: {
    isEmail: {
      errorMessage: 'Email tidak valid'
    },
    trim: true,
    notEmpty: {
      errorMessage: 'Field email wajib diisi'
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
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password minimal 8 karakter'
    },
    notEmpty: 'Field password wajib diisi'
  }
}), {
  message: 'Terdapat Field yang tidak diizinkan',
  locations: ['body']
});


module.exports = { createUserValidation };
