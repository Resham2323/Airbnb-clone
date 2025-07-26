const express = require("express");
const Review = require("../models/Review.js");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../Utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js")

//review post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.newReview));

router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;