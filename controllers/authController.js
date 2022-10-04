const User = require("../models/user");
const GlobalError = require("../error/GlobalError");
const catchAsync = require("../utils/catchAsync");
const sendMail = require("../utils/email");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.createToken = createToken;

exports.signup = catchAsync(async (req, res, next) => {
  const userDetails = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  const user = await User.create(userDetails);
  user.password = undefined;

  const token = createToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    data: { user },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.password || !req.body.email)
    return next(new GlobalError("Please provide email and password.", 400));

  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!user || !(await user.comparePassword(req.body.password, user.password)))
    return next(new GlobalError("Email or password is not correct.", 401));

  const token = createToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email)
    return next(new GlobalError("Please provide an email.", 400));

  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new GlobalError("User does not exists.", 401));

  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  const mailOptions = {
    email: user.email,
    subject: "Reset Password",
    message: `Click to the link: https://tello.az/${resetToken}`,
  };

  await sendMail(mailOptions);

  res.status(200).json({
    status: "success",
    message: "Token has been sent to the mail.",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetToken: hashedResetToken,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) return next(new GlobalError("Token is invalid or expired.", 400));

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  const token = createToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
