const productController = require("../controllers/productController");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");
const router = require("express").Router();

router.get("/", productController.getAllProducts);
router.post(
  "/",
  protectAuth,
  roleAccess("admin"),
  productController.addProduct
);
router.get("/:id", productController.getOneProduct);
router.patch(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  productController.updateProduct
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  productController.deleteProduct
);

module.exports = router;
