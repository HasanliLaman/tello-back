const Basket = require("../models/basket");
const GlobalError = require("../error/GlobalError");
const catchAsync = require("../utils/catchAsync");

exports.getBasket = catchAsync(async (req, res, next) => {
  const basket = await Basket.find();

  res.status(200).json({
    status: "success",
    length: basket.length,
    data: {
      basket,
    },
  });
});

exports.addProductToBasket = catchAsync(async (req, res, next) => {
  const productId = req.body.product;

  const product = await Basket.findOne({ product: productId });

  if (product) {
    const updatedBasketItem = await Basket.findByIdAndUpdate(
      product.id,
      { quantity: product.quantity + req.body.quantity },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      status: "success",
      data: {
        addedBasketItem: updatedBasketItem,
      },
    });
  }
  const addedBasketItem = await Basket.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      addedBasketItem,
    },
  });
});

exports.updateBasket = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedBasketItem = await Basket.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedBasketItem) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
    data: {
      updatedBasketItem,
    },
  });
});

exports.deleteBasketItem = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deletedBasketItem = await Basket.findByIdAndDelete(id);

  if (!deletedBasketItem) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
  });
});
