class AppError extends Error {
  constructor(message, statusCode, data = {}) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

const createError = (message, statusCode = 500, data = {}) => {
  return new AppError(message, statusCode, data);
};

module.exports = {
  AppError,
  createError,
};
