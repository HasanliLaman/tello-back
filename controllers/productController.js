const Product = require("../models/product");
const factory = require("../utils/factory");

exports.getAllProducts = factory.getAll(Product);

exports.getOneProduct = factory.getOne(Product);

exports.addProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
