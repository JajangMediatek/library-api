const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'fail',
      message: 'Token autentikasi diperlukan',
    });
  }

  const token = authHeader.slice('Bearer '.length).trim();

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Token autentikasi diperlukan',
    });
  }

  if (!process.env.JWT_SECRET) {
    return next(new Error('JWT_SECRET belum dikonfigurasi'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    req.user = {
      id: payload.sub,
    };

    return next();
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError' ||
      error.name === 'NotBeforeError'
    ) {
      return res.status(401).json({
        status: 'fail',
        message: 'Token tidak valid atau sudah kedaluwarsa',
      });
    }

    return next(error);
  }
};

module.exports = authenticate;
