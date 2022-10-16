const Category = require("../models/category");
const catchAsync = require("../utils/catchAsync");
const GlobalError = require("../error/GlobalError");
const GlobalFilter = require("../utils/GlobalFilter");
const factory = require("../utils/factory");

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const query = new GlobalFilter(
    Category.find({ subcategories: { $ne: null } }).populate("subcategories"),
    req.query
  );
  query.filter().sort().fields().paginate();
  const categories = await query.query;

  res.status(200).json({
    status: "success",
    length: categories.length,
    data: {
      categories,
    },
  });
});

exports.getOneCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findById(id).populate("subcategories");

  if (!category) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.addCategory = factory.createOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
