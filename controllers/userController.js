const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const GlobalError = require("../error/GlobalError");
const { createToken } = require("./authController");

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    length: users.length,
    data: { users },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

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
