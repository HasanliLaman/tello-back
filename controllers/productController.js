const Product = require("../models/product");
const catchAsync = require("../utils/catchAsync");
const GlobalError = require("../error/GlobalError");
const GlobalFilter = require("../utils/GlobalFilter");
const factory = require("../utils/factory");

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

exports.addProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
