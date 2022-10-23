const bookingController = require("../controllers/bookingController");
const router = require("express").Router();
const protectAuth = require("../middleware/protectAuth");

router.post("/checkout/:productId", protectAuth, bookingController.checkout);

module.exports = router;
