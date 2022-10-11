const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const GlobalError = require("../error/GlobalError");
const factory = require("../utils/factory");
const { createToken } = require("./authController");

exports.getUsers = factory.getAll(User);

exports.getUserById = factory.getOne(User);

exports.changeMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePassword(req.body.currentPassword, user.password)))
    return next(new GlobalError("Current password is not correct.", 400));

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  const token = createToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.changeMyData = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword)
    return next(new GlobalError("You cannot update password here.", 400));

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
