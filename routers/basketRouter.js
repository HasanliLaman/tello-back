const basketController = require("../controllers/basketController");
const protectAuth = require("../middleware/protectAuth");
const router = require("express").Router();

router.get("/", protectAuth, basketController.getBasket);
router.post("/", protectAuth, basketController.addProductToBasket);
router.update("/:id", protectAuth, basketController.updateBasket);
router.delete("/:id", protectAuth, basketController.deleteBasketItem);

module.exports = router;
