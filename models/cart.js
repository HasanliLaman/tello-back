const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required."],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: [true, "Product ID is required."],
          unique: true,
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required."],
        },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

cartSchema.virtual("totalQuantity").get(function () {
  return this.products.reduce((curr, prev) => curr + prev.quantity, 0);
});

cartSchema.virtual("totalPrice").get(function () {
  return this.products.reduce(
    (curr, prev) => curr + prev.quantity * prev.product.price,
    0
  );
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
