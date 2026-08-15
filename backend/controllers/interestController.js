import Interest from "../models/Interest.js";
import Listing from "../models/Listing.js";
import Compatibility from "../models/Compatibility.js";
import User from "../models/User.js";   
import { sendEmail } from "../services/emailService.js";

export const sendInterest = async(req,res)=>{

    try{

        const listing = await Listing.findById(req.params.listingId);

        if(!listing)
            return res.status(404).json({
                message:"Listing not found"
            });

        const compatibility =
            await Compatibility.findOne({

                tenant:req.user.id,

                listing:listing._id

            });

        const exists =
            await Interest.findOne({

                tenant:req.user.id,

                listing:listing._id

            });

        if(exists)
            return res.status(400).json({
                message:"Already requested"
            });

        const interest =
            await Interest.create({

                tenant:req.user.id,

                owner:listing.owner,

                listing:listing._id,

                compatibility:
                    compatibility?._id

            });
        if (compatibility && compatibility.score >= 80) {
            const owner = await User.findById(listing.owner);

            await sendEmail(
                owner.email,
                "High Compatibility Interest",
                `A tenant with compatibility score ${compatibility.score} has shown interest in your listing.`
            );

        }
        res.status(201).json(interest);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

export const updateInterest = async(req,res)=>{

    try{

        const interest =
            await Interest.findById(req.params.id);

        if(!interest)
            return res.status(404).json({
                message:"Interest not found"
            });

        if(
            interest.owner.toString() !==
            req.user.id
        ){

            return res.status(403).json({
                message:"Access denied"
            });

        }

        interest.status = req.body.status;

        await interest.save();

        // const tenant = await User.findById(interest.tenant);

        // await sendEmail(
        //     tenant.email,
        //     "Interest Status Updated",
        //     `Your request has been ${interest.status}.`
        // );

        res.json(interest);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

export const getOwnerInterests = async (req, res) => {
    try {

        const interests = await Interest.find({
            owner: req.user.id
        })
        .populate("tenant", "name email")
        .populate("listing")
        .populate("compatibility");

        res.json(interests);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getMyInterests = async (req, res) => {

    try {

        const interests = await Interest.find({
            tenant: req.user.id
        })
        .populate("listing")
        .populate("compatibility");

        res.json(interests);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};