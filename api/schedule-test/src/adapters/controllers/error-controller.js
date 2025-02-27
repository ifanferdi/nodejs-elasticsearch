module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode || 500).json({
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    return res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};
