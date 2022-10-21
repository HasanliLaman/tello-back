const Product = require("../models/product");
const catchAsync = require("../utils/catchAsync");
const GlobalError = require("../error/GlobalError");
const GlobalFilter = require("../utils/GlobalFilter");
const factory = require("../utils/factory");
const cloudinary = require("../utils/cloudinary");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const query = new GlobalFilter(
    Product.find().populate({
      path: "categories",
      select: "name slug",
    }),
    req.query
  );
  query.filter().sort().fields().paginate();
  const products = await query.query;

  res.status(200).json({
    status: "success",
    length: products.length,
    data: {
      products,
    },
  });
});

exports.getOneProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate({
    path: "categories",
    select: "name slug",
  });

  if (!product) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.addProduct = catchAsync(async (req, res, next) => {
  const images = [];
  const request = { ...req.body };

  if (req.files) {
    for (const el of req.files) {
      const img = await cloudinary.v2.uploader.upload(el.path);
      images.push({ url: img.secure_url, publicId: img.public_id });
    }

    request.assets = images;
  }

  const product = await Product.create(request);

  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const images = [];
  const request = { ...req.body };

  if (req.files) {
    for (const el of req.files) {
      const img = await cloudinary.v2.uploader.upload(el.path);
      images.push({ url: img.secure_url, publicId: img.public_id });
    }

    request.assets = images;
  }

  const id = req.params.id;
  const product = await Product.findByIdAndUpdate(id, request, {
    new: true,
    runValidators: true,
  });

  if (!product) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.deleteProduct = factory.deleteOne(Product);
