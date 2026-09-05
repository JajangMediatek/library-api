const { checkSchema, body } = require("express-validator");

const createBookValidation = checkSchema({
  code: {
    trim: true,
    isString: {
      errorMessage: "Field Code harus berupa String"
    },
    notEmpty: {
      errorMessage: "Field Code wajib diisi"
    },
  },
  title: {
    trim: true,
    isString: {
  errorMessage: "Field Judul harus berupa String"
    },
    notEmpty: {
      errorMessage: "Field Judul Wajib diiisi"
    },
  },
  author: {
    trim: true,
    isString: {
      errorMessage: "Field author harus berupa String"
    },
    notEmpty: {
      errorMessage: "Field author wajib diisi"
    },
  },
  publisher: {
    trim: true,
      isString: {
        errorMessage: "Field publisher harus berupa String"
      },
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
    trim: true,
    isString: {
      errorMessage: "Field sinopsis harus berupa String"
    },
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
    isString: {
      errorMessage: "url tidak valid"
    },
  }

});

const updateBookValidation = checkSchema({
  code: {
    trim: true,
    isString: {
      errorMessage: "Field Code harus berupa String"
    },
    optional: true
  },
  title: {
    trim: true,
    isString: {
  errorMessage: "Field Judul harus berupa String"
    },
    optional: true
  },
  author: {
    trim: true,
    isString: {
      errorMessage: "Field author harus berupa String"
    },
    optional: true
  },
  publisher: {
    trim: true,
      isString: {
        errorMessage: "Field publisher harus berupa String"
    },
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
    trim: true,
    isString: {
      errorMessage: "Field sinopsis harus berupa String"
    },
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
    isString: {
      errorMessage: "url tidak valid"
    },
  }
});

module.exports = { createBookValidation, updateBookValidation };
