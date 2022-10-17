const Cart = require("../models/cart");
const Product = require("../models/product");
const GlobalError = require("../error/GlobalError");
const GlobalFilter = require("../utils/GlobalFilter");
const catchAsync = require("../utils/catchAsync");
const factory = require("../utils/factory");

exports.updateCart = factory.updateOne(Cart);

exports.createCart = factory.createOne(Cart);

exports.deleteCart = factory.deleteOne(Cart);

exports.getAllCarts = catchAsync(async (req, res, next) => {
  let query;
  if (req.params.userId)
    query = new GlobalFilter(
      Cart.find({ user: req.params.userId }).populate({
        path: "products.product",
        select: "name price image",
      }),
      req.query
    );
  else query = new GlobalFilter(Cart.find(), req.query);
  query.filter().sort().fields().paginate();
  const doc = await query.query;

  res.status(200).json({
    status: "success",
    length: doc.length,
    data: {
      doc,
    },
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const doc = await Cart.findById(id).populate({
    path: "products.product",
    select: "name price image",
  });

  if (!doc) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.params.userId });
  if (!cart) return next(new GlobalError("User does not exists.", 400));

  const product = await Product.findById(req.body.product);
  if (!product) return next(new GlobalError("Product does not exists.", 400));

  let products = [...cart.products];

  if (products.find((el) => el.product.toString() === req.body.product)) {
    products.find(
      (el) => el.product.toString() === req.body.product
    ).quantity += req.body.quantity;
  } else
    products.push({ product: req.body.product, quantity: req.body.quantity });

  const updatedCart = await Cart.findByIdAndUpdate(
    cart.id,
    { products },
    { runValidators: true, new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      cart: updatedCart,
    },
  });
});

exports.deleteCartItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.params.userId });
  if (!cart) return next(new GlobalError("User does not exists.", 400));

  let products = [...cart.products];
  const product = products.find(
    (el) => el.product.toString() === req.body.product
  );

  if (!product)
    return next(new GlobalError("Cart does not contain this product.", 400));

  products = products.filter((el) => {
    if (el.product.toString() === req.body.product) return false;
    return true;
  });

  const updatedCart = await Cart.findByIdAndUpdate(
    cart.id,
    { products },
    { runValidators: true, new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      cart: updatedCart,
    },
  });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.params.userId });
  if (!cart) return next(new GlobalError("User does not exists.", 400));

  let products = [...cart.products];
  const product = products.find(
    (el) => el.product.toString() === req.body.product
  );

  if (!product)
    return next(new GlobalError("Cart does not contain this product.", 400));

  product.quantity = req.body.quantity;

  const updatedCart = await Cart.findByIdAndUpdate(
    cart.id,
    { products },
    { runValidators: true, new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      cart: updatedCart,
    },
  });
});

exports.emptyCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.params.userId });
  if (!cart) return next(new GlobalError("User does not exists.", 400));

  const updatedCart = await Cart.findByIdAndUpdate(
    cart.id,
    { products: [] },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      cart: updatedCart,
    },
  });
});
