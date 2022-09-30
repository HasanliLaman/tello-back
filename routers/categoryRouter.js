const categoryController = require("../controllers/categoryController");
const router = require("express").Router();

router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.addCategory);
router.get("/:id", categoryController.getOneCategory);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
