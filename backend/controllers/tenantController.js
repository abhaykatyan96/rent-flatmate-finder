import TenantProfile from "../models/TenantProfile.js";

export const createTenantProfile = async (req, res) => {
    try {
        const exists = await TenantProfile.findOne({ user: req.user.id });
        if (exists) {
            return res.status(400).json({ message: "Profile already exists" });
        }
        const profile = await TenantProfile.create({ ...req.body, user: req.user.id });
        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTenantProfile = async (req, res) => {

    try {

        const profile = await TenantProfile.findOne({
            user: req.user.id
        });

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.json(profile);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const updateTenantProfile = async (req, res) => {

    try {

        const profile = await TenantProfile.findOne({
            user: req.user.id
        });

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        profile.preferredLocation =
            req.body.preferredLocation || profile.preferredLocation;

        profile.minBudget =
            req.body.minBudget || profile.minBudget;

        profile.maxBudget =
            req.body.maxBudget || profile.maxBudget;

        profile.moveInDate =
            req.body.moveInDate || profile.moveInDate;

        await profile.save();

        res.json(profile);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};