const Listing =  require("../models/listing.js");
const ExpressError =require("../Utils/ExpressError.js");


module.exports.index = async(req, res)=> { 
    const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.newListing =  (req, res) => {
          res.render("listings/new.ejs");
      }


module.exports.showListing = async(req, res) => {
          let {id} = req.params;
          const listing = await Listing.findById(id).populate({
            path:"reviews", populate:{
            path:"author"
          }
        }).populate("owner");
          if(!listing) {
            req.flash("error", "Listing you requested for doesn't exist!");
             res.redirect("/listings");
          }
          res.render("listings/show.ejs", { listing});
      }

module.exports.createListing = async (req, res, next) => {

  console.log("Payload:", req.body.listing);
  const { latitude, longitude } = req.body.listing;

  // Ensure these are present
  if (!latitude || !longitude) {
    req.flash("error", "Coordinates missing. Please select a location.");
    return res.redirect("/listings/new");
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    req.flash("error", "Invalid coordinates. Try selecting the location again.");
    return res.redirect("/listings/new");
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {
    url: req.file.path,
    filename: req.file.filename,
  };
  newListing.geometry = {
    type: "Point",
    coordinates: [lon, lat],
  };

  try {
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  } catch (e) {
    next(e);
  }
}



module.exports.editListing = async(req, res) => {
  
          let {id} = req.params;
           const listing = await Listing.findById(id);
               if(!listing) {
            req.flash("error", "Listing you requested for doesn't exist!");
            return res.redirect("/listings");
          }
          let ogImgUrl = listing.image.url;
          ogImgUrl = ogImgUrl.replace("/uploads", "/uploads/w_250")

           res.render("listings/edit.ejs", {listing, ogImgUrl});
      }


module.exports.updateListing = async(req, res) => {
  if(!req.body.listing) {
    throw new ExpressError(400, "Please send valid data for listings");
  }
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new: true});

  // Image update only if a new file is uploaded
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req, res) => {
          let {id} = req.params;
          const deletedListing = await Listing.findByIdAndDelete(id);
          console.log(deletedListing);
          req.flash("success", "Listing Deleted");
          res.redirect("/listings");
      }
