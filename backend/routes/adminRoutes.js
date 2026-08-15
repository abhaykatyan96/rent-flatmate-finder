import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
    getUsers,
    deleteUser,
    getListings,
    deleteListing,
    getInterests
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

router.get("/listings", getListings);
router.delete("/listings/:id", deleteListing);

router.get("/interests", getInterests);

export default router;