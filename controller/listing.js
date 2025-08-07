const Listing =  require("../models/listing.js");
const ExpressError =require("../Utils/ExpressError.js");
const axios = require("axios");

module.exports.index = async(req, res)=> { 
    const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.newListing =  (req, res) => {
          res.render("listings/new.ejs");
      }


module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist!");
    return res.redirect("/listings");
  }

  // Only assign geometry if you actually fetched geoData
  // listing.geometry = geoData.body.features[0].geometry;

  res.render("listings/show.ejs", { listing });
};
module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist!");
    return res.redirect("/listings");
  }
  // Only assign geometry if you actually fetched geoData
  // listing.geometry = geoData.body.features[0].geometry;
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    const { listing } = req.body;

    // Step 1: Call Geoapify to get coordinates using location string
    const geoRes = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${listing.location}&apiKey=b64015e75aff4a0fa6611a0c27e86a83`
    );
    const feature = geoRes.data.features[0];

    if (!feature) {
      return res.status(400).send("Could not geocode the location.");
    }

    const [lon, lat] = feature.geometry.coordinates;

    // Step 2: Create new listing with geometry
    const newListing = new Listing({
      ...listing,
      geometry: {
        type: "Point",
        coordinates: [lon, lat], // GeoJSON requires [lon, lat]
      },
    });

    // Step 3: Handle image upload
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // Step 4: Set owner and save
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  } catch (err) {
    console.error("Listing create error:", err.message);
    next(err);
  }
};


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


module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Please send valid data for listings");
  }

  const { id } = req.params;
  let listing = await Listing.findById(id);

  // Update all basic fields (title, price, location, etc.)
  Object.assign(listing, req.body.listing);

  // Step 1: Handle location update (Geoapify)
  if (req.body.listing.location) {
    const geoRes = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${req.body.listing.location}&apiKey=b64015e75aff4a0fa6611a0c27e86a83`
    );

    const feature = geoRes.data.features[0];
    if (feature && feature.geometry) {
      listing.geometry = feature.geometry;
    }
  }
  // Step 2: Handle image update
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  //  Step 3: Save changes
  await listing.save();

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req, res) => {
          let {id} = req.params;
          const deletedListing = await Listing.findByIdAndDelete(id);
          console.log(deletedListing);
          req.flash("success", "Listing Deleted");
          res.redirect("/listings");
      }

