const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const factory = require("../utils/factory");

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.productId });

  res.json({
    status: "success",
    length: reviews.length,
    data: { reviews },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create({
    ...req.body,
    creator: req.user._id,
    product: req.params.productId,
  });

  res.json({
    status: "success",
    data: { review },
  });
});

exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
