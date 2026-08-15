import express from "express";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
    calculateCompatibility
} from "../controllers/compatibilityController.js";

const router = express.Router();

router.get(
    "/:listingId",
    protect,
    authorize("tenant"),
    calculateCompatibility
);

export default router;