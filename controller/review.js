
const Review = require("../models/Review.js");
const Listing =  require("../models/listing.js");

module.exports.newReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;                                                         
    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save()
     req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`)
}
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  const review = await Review.findById(reviewId);
  console.log(req.user);
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};