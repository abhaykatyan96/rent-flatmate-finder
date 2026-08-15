import Chat from "../models/Chat.js";
import Interest from "../models/Interest.js";

export const getMessages = async (req, res) => {
    try {

        const listingId = req.params.listingId;

        const interest = await Interest.findOne({
            listing: listingId,
            $or: [
                { tenant: req.user.id },
                { owner: req.user.id }
            ],
            status: "Accepted"
        });

        if (!interest) {
            return res.status(403).json({
                message: "Chat is available only after the interest is accepted."
            });
        }

        const messages = await Chat.find({
            listing: listingId
        })
        .populate("sender", "name")
        .populate("receiver", "name")
        .sort({ createdAt: 1 });

        res.json(messages);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};