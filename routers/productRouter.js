const productController = require("../controllers/productController");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");
const multer = require("multer");
const router = require("express").Router();
const upload = multer({ storage: multer.diskStorage({}) });

router.get("/", productController.getAllProducts);
router.post(
  "/",
  protectAuth,
  roleAccess("admin"),
  upload.array("assets", 10),
  productController.addProduct
);
router.get("/search", productController.searchText);
router.get("/:id", productController.getOneProduct);
router.patch(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  upload.array("assets", 15),
  productController.updateProduct
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  productController.deleteProduct
);

module.exports = router;
