const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack || err.message || err);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
