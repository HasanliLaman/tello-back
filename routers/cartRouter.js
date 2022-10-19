const cartController = require("../controllers/cartController");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");
const router = require("express").Router({ mergeParams: true });

router.patch(
  "/add/:productId",
  protectAuth,
  roleAccess("user"),
  cartController.addToCart
);
router.patch(
  "/delete/:productId",
  protectAuth,
  roleAccess("user"),
  cartController.deleteCartItem
);
router.patch(
  "/update/:productId",
  protectAuth,
  roleAccess("user"),
  cartController.updateCartItem
);
router.patch(
  "/empty",
  protectAuth,
  roleAccess("user"),
  cartController.emptyCart
);

router.get("/", protectAuth, cartController.getAllCarts);
router.get("/:id", protectAuth, cartController.getCart);
router.post("/", protectAuth, roleAccess("admin"), cartController.createCart);
router.patch(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  cartController.updateCart
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  cartController.deleteCart
);

module.exports = router;
