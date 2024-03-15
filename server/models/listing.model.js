import mongoose from "mongoose";

const listingSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          members: {
            type: Number,
            required: true,
          },
          regularPrice: {
            type: Number,
            required: true,
          },
          discountPrice: {
            type: Number,
            required: true,
          },
          type: {
            type: String,
            required: true,
          },
          imageUrls: {
            type: Array,
            required: false,
          },
          userRef: {
            type: String,
            required: true,
          },
      
    },
    { timestamps: true }
)

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;