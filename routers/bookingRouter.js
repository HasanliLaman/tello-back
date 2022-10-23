const bookingController = require("../controllers/bookingController");
const router = require("express").Router();
const protectAuth = require("../middleware/protectAuth");

router.post("/checkout", protectAuth, bookingController.checkout);

module.exports = router;
