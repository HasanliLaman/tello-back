const router = require("express").Router({ mergeParams: true });
const reviewController = require("../controllers/reviewController");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");

router.get("/", reviewController.getReviews);
router.post(
  "/",
  protectAuth,
  roleAccess("user"),
  reviewController.createReview
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("user"),
  reviewController.deleteReview
);
router.get("/:id", reviewController.getReview);
router.patch(
  "/:id",
  protectAuth,
  roleAccess("user"),
  reviewController.updateReview
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("user"),
  reviewController.deleteReview
);

module.exports = router;
