const GlobalError = require("./GlobalError");

const handleDuplicateFields = (err) => {
  const msg = `Duplicate field value.`;
  return new GlobalError(msg, 400);
};

const handleCastError = (err) => {
  const msg = `Invalid ${err.path}: ${err.value}.`;
  return new GlobalError(msg, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors)
    .map((el) => el.message)
    .join(". ");
  const msg = `Invalid input data. ${errors}`;
  return new GlobalError(msg, 400);
};

const handleInvalidToken = () => {
  return new GlobalError("Token is invalid.", 401);
};

const handleExpiredToken = () => {
  return new GlobalError("Token is expired.", 401);
};

const sendDevelopmentError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendProductionError = (err, res) => {
  if (err.operational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") sendDevelopmentError(err, res);
  else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastError(err);
    if (err.code === 11000) err = handleDuplicateFields(err);
    if (err.name === "ValidationError") err = handleValidationError(err);
    if (err.name === "JsonWebTokenError") err = handleInvalidToken();
    if (err.name === "TokenExpiredError") err = handleExpiredToken();

    sendProductionError(err, res);
  }
};

module.exports = errorHandler;
