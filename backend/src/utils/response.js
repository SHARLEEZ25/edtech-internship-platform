const successResponse = (res, statusCode, data) => {
  return res.status(statusCode).json(data);
};

const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    error: true,
    message,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
