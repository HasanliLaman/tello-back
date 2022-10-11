const Category = require("../models/category");
const factory = require("../utils/factory");

exports.getAllCategories = factory.getAll(Category);

exports.getOneCategory = factory.getOne(Category);

exports.addCategory = factory.createOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
