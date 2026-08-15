import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { createListing, getAllListings, getMyListings, updateListing, deleteListing, markFilled } from "../controllers/listingController.js";

const router = express.Router();

router.post("/", protect, authorize("owner"), createListing);
router.get("/", getAllListings);
router.get(
    "/my",
    protect,
    authorize("owner"),
    getMyListings
);
router.get("/owner",protect, authorize("owner"), getMyListings);
router.put("/:id", protect, authorize("owner"), updateListing);
router.delete("/:id", protect, authorize("owner"), deleteListing);
router.patch("/:id/fill", protect, authorize("owner"), markFilled);

export default router;  