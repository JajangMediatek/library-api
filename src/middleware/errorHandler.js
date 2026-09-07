export const errorHandler = (err, req, res, next) => {
  console.log('[SERVER ERROR]:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan pada server';

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid JSON format'
    });
  }

  return res.status(statusCode).json({
    status: 'fail',
    message: message
  })
}
