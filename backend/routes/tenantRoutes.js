import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { createTenantProfile, getTenantProfile, updateTenantProfile } from "../controllers/tenantController.js";

const router = express.Router();

router.post(
    "/profile",
    protect,
    authorize("tenant"),
    createTenantProfile
);
router.get(
    "/profile",
    protect,
    authorize("tenant"),
    getTenantProfile
);

router.put(
    "/profile",
    protect,
    authorize("tenant"),
    updateTenantProfile
);

export default router;