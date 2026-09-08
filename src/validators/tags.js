const { checkSchema, checkExact } = require("express-validator");

const createTagValidation = checkExact(checkSchema({
  name: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field nama harus berupa string')
        }
        return true;
      }
    },
    trim: true,
    notEmpty: {
      errorMessage: "Field nama wajib diisi"
    },
  }
}), {
  message: "Terdapat Field yang tidak diizinkan",
  locations: ['body'],
});

const updateTagValidation = checkExact(checkSchema({
  name: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field nama harus berupa string')
        }
        return true;
      }
    },
    trim: true,
  }
}), {
  message: "Terdapat Field yang tidak diizinkan",
  locations: ['body'],
});

module.exports = {createTagValidation, updateTagValidation}
