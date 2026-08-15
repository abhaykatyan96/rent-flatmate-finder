import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Interest from "../models/Interest.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getListings = async (req, res) => {
    try {
        const listings = await Listing.find().populate("owner", "name email");
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteListing = async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.json({ message: "Listing deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getInterests = async (req, res) => {
    try {
        const interests = await Interest.find()
            .populate("tenant", "name email")
            .populate("owner", "name email")
            .populate("listing");

        res.json(interests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};