const authorize = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user || !Array.isArray(req.user.roles)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Akses ditolak, informasi role tidak ditemukan'
      });
    }

    const hasPermission = allowedRoles.some((role) => req.user.roles.includes(role));

    if (!hasPermission) {
      return res.status(403).json({
        status: 'fail',
        message: 'Anda Tidak memiliki hak akses untuk melakukan tindakan ini'
      })
    }

    next();
  }
}

module.exports = authorize;
