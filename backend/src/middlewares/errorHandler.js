const { AppError } = require("../utils/appError");

module.exports = (err, req, res, next) => {
  // Log always
  console.error(err);

  // Operational / expected errors
  if (err instanceof AppError) {
    const payload = {
      error: true,
      message: err.message,
    };

    if (err.data && typeof err.data === "object") {
      Object.assign(payload, err.data);
    }

    return res.status(err.statusCode).json(payload);
  }

  // Unknown / programming errors
  return res.status(500).json({
    error: true,
    message: "Internal Server Error",
  });
};
