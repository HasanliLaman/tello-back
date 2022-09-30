const Product = require("../models/product");
const GlobalError = require("../error/GlobalError");
const GlobalFilter = require("../utils/GlobalFilter");
const catchAsync = require("../utils/catchAsync");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = new GlobalFilter(Product.find(), req.query);
  products.filter().sort().fields().paginate();
  const filteredProducts = await products.query;

  res.status(200).json({
    status: "success",
    length: filteredProducts.length,
    data: {
      products: filteredProducts,
    },
  });
});

exports.getOneProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (!product) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.addProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      newProduct,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedProduct) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
    data: {
      updatedProduct,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) return next(new GlobalError("Invalid ID!", 404));

  res.status(204).json({
    status: "success",
  });
});
