const categoryController = require("../controllers/categoryController");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");
const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.diskStorage({}) });

router.get("/", categoryController.getAllCategories);
router.post(
  "/",
  protectAuth,
  roleAccess("admin"),
  upload.single("image"),
  categoryController.addCategory
);
router.get("/:id", categoryController.getOneCategory);
router.patch(
  "/:id",
  protectAuth,
  // roleAccess("admin"),
  upload.single("image"),
  categoryController.updateCategory
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  categoryController.deleteCategory
);

module.exports = router;
