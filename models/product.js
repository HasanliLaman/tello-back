const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required."],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required."],
    },
    image: {
      type: String,
      unique: true,
      required: [true, "Image is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    assets: {
      type: [String],
      required: [true, "Assets are required."],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        require: [true, "Category array is required."],
      },
    ],
    colors: {
      type: [String],
      required: [true, "Color array is required."],
    },
    storage: {
      type: [String],
      required: [true, "Storage array is required."],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
