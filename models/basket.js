const mongoose = require("mongoose");

const basketSchema = mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: [true, "Product ID is required."],
          uniquie: true,
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required."],
        },
      },
    ],
  },
  { timestamps: true }
);

const Basket = mongoose.model("basket", basketSchema);

module.exports = Basket;
