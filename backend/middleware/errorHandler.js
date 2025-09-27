const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
};

const errorHandler = (err, req, res, _next) => {
  console.error('[Error]', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
};

module.exports = { notFoundHandler, errorHandler };
