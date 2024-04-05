import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async(req , res , next) =>{
    try{
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);

    }catch(error){
        next(error); 
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
  
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
  
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }
  
    try {
      await Listing.findByIdAndDelete(req.params.id);
      res.status(200).json('Listing has been deleted!');
    } catch (error) {
      next(error);
    }
  };

  export const updateListing = async (req , res , next) =>{
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        next(errorHandler(404 , "listing not found!"));
    if(req.user.id != listing.userRef){
        next(errorHandler(401 , "unauthorized to update"));
    }
    }else{
        try{
            const updatedList =await Listing.findByIdAndUpdate(
                req.params.id,
                req.body,
                {new:true},

            );

            res.status(200).json(updatedList);

        }catch(error){
            next(error);
        }
    }
  }

  export const getListing = async (req, res , next) =>{
    try{
        const listing =await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404 ,"listing not found"));
        }

         res.status(200).json(listing);
    }catch(error){
        next(error);
    }
  }

  export const getAllListings = async(req,res,next) =>{
    try{
        const allListings = await Listing.find({});
        if (!allListings || allListings.length === 0) {
            // Handle case where no listings are found
            return res.status(404).json({ error: "Not found" });
        }
        res.status(200).json(allListings);
        if(!allListings){
            return next(errorHandler(404 , "not found"));
        }
    }catch(error){
        next(error);
    }

  }