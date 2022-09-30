const productController = require("../controllers/productController");
const router = require("express").Router();

router.get("/", productController.getAllProducts);
router.post("/", productController.addProduct);
router.get("/:id", productController.getOneProduct);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
