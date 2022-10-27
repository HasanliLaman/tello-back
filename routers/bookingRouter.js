const bookingController = require("../controllers/bookingController");
const router = require("express").Router();
const protectAuth = require("../middleware/protectAuth");

router.post("/checkout", protectAuth, bookingController.checkout);
router.post("/webhook", bookingController.webhook);

module.exports = router;
