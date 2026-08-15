import Listing from "../models/Listing.js";

export const createListing = async (req, res) => {
    try{
        const listing = await Listing.create({ ...req.body,owner: req.user.id });
        res.status(201).json(listing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllListings = async (req, res) => {
    try{
        const {
            location,
            minBudget,
            maxBudget,
            roomType,
            furnishingStatus,
            page= 1,
            limit= 10
        } = req.query;
        let query = {
            isFilled: false
        };

        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        if (minBudget || maxBudget) {
            query.rent = {};
            if (minBudget) {
                query.rent.$gte = Number(minBudget);
            }
            if (maxBudget) {
                query.rent.$lte = Number(maxBudget);
            }
        }
        if (roomType) {
            query.roomType = roomType;
        }
        if (furnishingStatus) {
            query.furnishingStatus = furnishingStatus;
        }
        const listings = await Listing.find(query)
            .populate("owner", "name email")
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Listing.countDocuments(query);
        res.status(200).json({
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            listings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyListings = async (req, res) => {

    try {

        const listings = await Listing.find({
            owner: req.user.id
        }).populate("owner","name email");

        res.json(listings);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const getOwnerListings = async (req, res) => {
    try {

        const listings = await Listing.find({
            owner: req.user.id
        }).populate("owner","name email");

        res.json(listings);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const updateListing = async (req, res) => {
    try{
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        if (listing.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedListing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteListing = async (req, res) => {
    try{
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        if (listing.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markFilled = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        console.log("Listing Owner:", listing.owner.toString());
        console.log("Logged-in User:", req.user.id);
        console.log("Role:", req.user.role);

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (listing.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied",
                listingOwner: listing.owner.toString(),
                loggedInUser: req.user.id,
                role: req.user.role
            });
        }

        listing.isFilled = true;
        await listing.save();

        res.json({
            message: "Listing marked as filled",
            listing
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};