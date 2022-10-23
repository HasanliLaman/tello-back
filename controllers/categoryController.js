const Category = require("../models/category");
const catchAsync = require("../utils/catchAsync");
const GlobalError = require("../error/GlobalError");
const GlobalFilter = require("../utils/GlobalFilter");
const factory = require("../utils/factory");
const cloudinary = require("../utils/cloudinary");

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

exports.addCategory = catchAsync(async (req, res, next) => {
  const request = { ...req.body };

  if (req.file) {
    const img = await cloudinary.v2.uploader.upload(req.file.path);
    request.image = {
      url: img.url,
      publicId: img.public_id,
    };
  }

  const category = await Category.create(request);

  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const request = { ...req.body };

  if (req.file) {
    const img = await cloudinary.v2.uploader.upload(req.file.path);
    request.image = {
      url: img.url,
      publicId: img.public_id,
    };
  }

  const id = req.params.id;
  const category = await Category.findByIdAndUpdate(id, request, {
    new: true,
    runValidators: true,
  });

  if (!category) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.deleteCategory = factory.deleteOne(Category);
