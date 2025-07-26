const Listing = require("./models/listing.js");
const Review = require("./models/Review.js");
const {listingSchema} = require("./Schema.js");
const {reviewSchema} = require("./Schema.js");
const ExpressError =require("./Utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
         req.session.redirectUrl = req.originalUrl;
          req.flash("error", "user must be logged in to create listing");
           return res.redirect("/login");
        }
        next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing || !listing.owner) {
        req.flash("error", "listing nor found or owner not assigned");
        return res.redirect(`/listings/${id}`)
    }
   
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
         req.flash("error", "ypu don't have permission to edit");
         return res.redirect(`/listings/${id}`);
    }
      next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
      if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
      }else{
        next();
      }  
      }

module.exports.validateReview = (req, res, next) => {
        let {error} = reviewSchema.validate(req.body);
          if(error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
         }else{
              next();
         }
      }

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You didn't create this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
}; 
      