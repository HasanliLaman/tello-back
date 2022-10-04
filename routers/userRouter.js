const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const protectAuth = require("../middleware/protectAuth");
const router = require("express").Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.patch("/changeMyPassword", protectAuth, userController.changeMyPassword);
router.patch("/changeMyData", protectAuth, userController.changeMyData);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:resetToken", authController.resetPassword);

module.exports = router;
