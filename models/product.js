const mongoose = require("mongoose");
const { MongooseFindByReference } = require("mongoose-find-by-reference");

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
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    assets: [
      {
        type: {
          url: String,
          publicId: String,
        },
        required: [true, "Assets array is required."],
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "Category array is required."],
      },
    ],
    colors: {
      type: [String],
      default: [],
    },
    storage: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("image").get(function () {
  return this.assets[0];
});

productSchema.plugin(MongooseFindByReference);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
