const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn, 
  upload.single("image"),
     validateListing,
     wrapAsync(listingController.createListing)),
     
      //New route
router.get("/new", isLoggedIn, listingController.newListing);

router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("image"), validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner,  wrapAsync(listingController.deleteListing));

  //edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.editListing ));
      
module.exports = router;