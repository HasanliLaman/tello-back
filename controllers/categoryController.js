const Category = require("../models/category");
const GlobalError = require("../error/GlobalError");
const GlobalFilter = require("../utils/GlobalFilter");
const catchAsync = require("../utils/catchAsync");

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    status: "success",
    length: categories.length,
    data: {
      categories: categories,
    },
  });
});

exports.getOneCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findById(id);

  if (!category) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.addCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      newCategory,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedCategory) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
    data: {
      updatedCategory,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deletedCategory = await Category.findByIdAndDelete(id);

  if (!deletedCategory) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
  });
});
