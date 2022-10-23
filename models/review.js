const mongoose = require("mongoose");
const Product = require("./product");

const reviewSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required."],
    },

    rating: {
      type: Number,
      required: [true, "Rating is required."],
      min: 1,
      max: 5,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "creator",
    select: "name",
  });
  next();
});

reviewSchema.statics.getAveRating = async function (productId) {
  const data = await this.aggregate([
    {
      $match: { product: productId },
    },

    {
      $group: {
        _id: "$product",
        ratingQuantity: { $sum: 1 },
        ratingAve: { $avg: "$rating" },
      },
    },
  ]);

  if (data.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: data[0].ratingAve,
      ratingsQuantity: data[0].ratingQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function (doc) {
  doc.constructor.getAveRating(doc.product);
});

reviewSchema.post(/^findOneAnd/, function (doc) {
  doc.constructor.getAveRating(doc.product);
});

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
