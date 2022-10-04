const User = require("../models/user");
const GlobalError = require("../error/GlobalError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

const roleAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new GlobalError("Access denied.", 401));
    next();
  };
};

module.exports = roleAccess;
