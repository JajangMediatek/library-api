const { checkSchema, body, checkExact } = require("express-validator");

const createBookValidation =checkExact(checkSchema({
  code: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field code harus berupa string')
        }
        return true;
      }
    },
    trim: true,
    notEmpty: {
      errorMessage: "Field Code wajib diisi"
    },
  },
  title: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field title harus berupa string')
        }
        return true;
      }
    },
    trim: true,
    notEmpty: {
      errorMessage: "Field Judul Wajib diiisi"
    },
  },
  author: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field author harus berupa string')
        }
          return true;
      }
    },
    trim: true,
    notEmpty: {
      errorMessage: "Field author wajib diisi"
    },
  },
  publisher: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field publisher harus berupa string')
        }
        return true;
      }
    },
    trim: true,
      notEmpty: {
        errorMessage: "Field publisher wajib diisi"
    }
  },
  published_year: {
    isInt: {
      options: { min: 1 },
      errorMessage: "Tahun tidak valid"
    },
    notEmpty: {
        errorMessage: "Field tahun rilis wajib diisi"
    },
    custom: {
      options: (value) => {
        const currentYear = new Date().getFullYear();
        if (value > currentYear) {
          throw new Error('Tahun tidak bisa di set lebih dari sekarang');
        }
        return true;
      },
    }
  },
  synopsis: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field synopsis harus berupa string')
        }
        return true;
      }
    },
    trim: true,
    optional: true
  },
  total_copies: {
    notEmpty: {
      errorMessage: "Field Total kopi wajib diiisi"
    },
    isInt: {
      options: { min: 0 },
      errorMessage: "Field Total kopi harus berupa angka dan minimal 0"
    }
  },
  cover_url: {
    optional: true,
    isURL: {
      options: {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_tld: false
      },
      errorMessage: "URL tidak valid"
    }
  }

}), {
  message: "Terdapat Field yang tidak diizinkan",
  locations: ['body'],
});

const updateBookValidation = checkExact(checkSchema({
  code: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field synopsis harus berupa string')
        }
        return true;
      }
    },
    trim: true,
    optional: true
  },
  title: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field synopsis harus berupa string')
        }
        return true;
      }
    },
    trim: true,
    optional: true
  },
  author: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field synopsis harus berupa string')
        }
        return true;
      }
    },
    trim: true,
    optional: true
  },
  publisher: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field synopsis harus berupa string')
        }
        return true;
      }
    },
    trim: true,
      optional: true
  },
  published_year: {
    isInt: {
      options: { min: 1 },
      errorMessage: "Tahun tidak valid"
    },
    optional: true,
    custom: {
      options: (value) => {
        const currentYear = new Date().getFullYear();
        if (value > currentYear) {
          throw new Error('Tahun tidak bisa di set lebih dari sekarang');
        }
        return true;
      },
    }
  },
  synopsis: {
    custom: {
      options: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Field synopsis harus berupa string')
        }
        return true;
      }
    },
    trim: true,
    optional: true
  },
  total_copies: {
    optional: true,
    isInt: {
      options: { min: 0 },
      errorMessage: "Field Total kopi harus berupa angka dan minimal 0"
    }
  },
  cover_url: {
    optional: true,
    isURL: {
      options: {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_tld: false
      },
      errorMessage: "URL tidak valid"
    }
  }
}), {
  locations: ['body'],
  message: "Terdapat Field yang tidak diizinkan"
});

module.exports = { createBookValidation, updateBookValidation };
