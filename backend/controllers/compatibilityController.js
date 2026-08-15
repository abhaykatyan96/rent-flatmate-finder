import Listing from "../models/Listing.js";
import TenantProfile from "../models/TenantProfile.js";
import Compatibility from "../models/Compatibility.js";

import {
    generateCompatibility
} from "../services/geminiService.js";

import fallbackScore from "../utils/fallbackScore.js";

export const calculateCompatibility = async (req, res) => {

    try {

        const listing = await Listing.findById(req.params.listingId);

        const tenant = await TenantProfile.findOne({
            user: req.user.id
        });

        if (!listing || !tenant)
            return res.status(404).json({
                message: "Data not found"
            });

        const existing = await Compatibility.findOne({
            tenant: req.user.id,
            listing: listing._id
        });

        if (existing)
            return res.json(existing);

        let result =
            await generateCompatibility(
                listing,
                tenant
            );

        if (!result)
            result =
                fallbackScore(
                    listing,
                    tenant
                );

        const compatibility =
            await Compatibility.create({

                tenant: req.user.id,

                listing: listing._id,

                score: result.score,

                explanation: result.explanation

            });

        res.json(compatibility);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};