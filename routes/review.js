const express = require("express");
const router = express.Router({ mergeParams: true });
// 引入控制器
const {
    getReviews,
    getReview,
    deleteReview,
    addReview,
} = require("../controllers/review.js");

// 路由鉴权
const { protect, authorize } = require("../middleware/auth.js");

const advancedResults = require("../middleware/advancedResults.js");
const Review = require("../models/Review.js");


router.route("/")
    .get(
        advancedResults(Review, {
            path: "brand",
            select: "name description",
        }),
        getReviews
    )
    .post(protect, authorize("admin", "user"), addReview);

router
    .route("/:id")
    .get(getReview)
    .delete(protect, authorize("admin", "user"), deleteReview);

module.exports = router;
