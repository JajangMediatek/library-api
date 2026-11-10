const { checkExact, checkSchema } = require('express-validator')

const createBookCopyValidation = checkExact(checkSchema({
  book_id: {
    notEmpty: {
      errorMessage: 'Field id buku wajib diisi'
    },
    isInt: {
      options: { min: 1 },
      errorMessage: 'id buku tidak valid'
    }
  },
  copy_code: {
    notEmpty: {
      errorMessage: 'Field kode copy wajib diisi'
    },
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field kode copy harus berupa string')
        }
        return true;
      }
    },
    trim: true,
  },
  condition: {
    notEmpty: {
      errorMessage: 'Field condition wajib diisi'
    },
    isIn: {
      options: [['good', 'fair', 'poor']],
      errorMessage: 'Condition tidak valid, pilih yang tersedia'
    },
  },
  condition_notes: {
    optional: true,
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field keteragan kondisi harus berupa string')
        }
        return true;
      }
    },
    trim: true,
  },
  status: {
    notEmpty: {
      errorMessage: 'Field status wajib diisi'
    },
    isIn: {
      options: [['available', 'maintenance', 'lost', 'retired']],
      errorMessage: 'Status tidak valid, pilih yang tersedia'
    },
  }
}), {
  locations: ['body'],
  message: 'Terdapat field yang tidak diizinkan'
})


const updateBookCopyValidation = checkExact(checkSchema({
  copy_code: {
    optional: true,
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field kode copy buku harus berupa string')
        }
        return true;
      }
    },
    trim: true,
  },
  condition: {
    optional: true,
    isIn: {
      options: [['good', 'fair', 'poor']],
      errorMessage: 'Condition tidak valid, pilih yang tersedia'
    },
  },
  condition_notes: {
    optional: true,
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field keteragan kondisi harus berupa string')
        }
        return true;
      }
    },
    trim: true,
  },
  status: {
    optional: true,
    isIn: {
      options: [['available', 'maintenance', 'lost', 'retired']],
      errorMessage: 'Status tidak valid, pilih yang tersedia'
    },
  }
}), {
  locations: ['body'],
  message: 'Terdapat field yang tidak diizinkan'
})


module.exports = { createBookCopyValidation, updateBookCopyValidation };
