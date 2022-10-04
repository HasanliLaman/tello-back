const categoryController = require("../controllers/categoryController");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");
const router = require("express").Router();

router.get("/", categoryController.getAllCategories);
router.post(
  "/",
  protectAuth,
  roleAccess("admin"),
  categoryController.addCategory
);
router.get("/:id", categoryController.getOneCategory);
router.patch(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  categoryController.updateCategory
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  categoryController.deleteCategory
);

module.exports = router;
