const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required!"],
    },
    slug: {
      type: String,
      required: [true, "Category name is required!"],
      unique: true,
    },
    parentID: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
