const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");
const router = require("express").Router();

router.get(
  "/me",
  protectAuth,
  userController.getMe,
  userController.getUserById
);

router.get("/", protectAuth, roleAccess("admin"), userController.getUsers);
router.get(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  userController.getUserById
);
router.patch("/changeMyPassword", protectAuth, userController.changeMyPassword);
router.patch("/changeMyData", protectAuth, userController.changeMyData);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:resetToken", authController.resetPassword);

module.exports = router;
