import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getMessages } from "../controllers/chatController.js";

const router = express.Router();

router.get("/:listingId", protect, getMessages);

export default router;