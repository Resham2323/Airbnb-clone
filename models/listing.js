const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./Review.js");
const { ref } = require('joi');

const listingSchema = new Schema({
    title: {
        type:String,
      
    },
    description :{
        type:String,
        required:true,
    },
    image:{
            url:String,
           filename:String,
    },
    price: {
        type:Number,
        required:true,
    },
    location:{
        type: String,
        required:true,
    },
    country:{
        type : String,
        required:true,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
    type: {
      type: String,
      enum: ['Point'],   // GeoJSON type
      required: true
    },
    coordinates: {
      type: [Number],    // [longitude, latitude]
      required: true
    }
  }

  },

);
listingSchema.index({ geometry: "2dsphere" });


listingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing) {
       await Review.deleteMany({ _id: {$in : listing.reviews}})
    }
} );

const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;