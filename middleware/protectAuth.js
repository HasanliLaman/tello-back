const catchAsync = require("../utils/catchAsync");
const GlobalError = require("../error/GlobalError");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const protectAuth = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer"))
    return next(new GlobalError("Please provide a token.", 401));

  const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);

  const user = await User.findById(decoded.id);
  if (!user) return next(new GlobalError("User does not exists.", 401));

  req.user = user;
  next();
});

module.exports = protectAuth;
