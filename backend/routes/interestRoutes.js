import express from "express";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
sendInterest,
updateInterest,
getOwnerInterests,
getMyInterests
}
from "../controllers/interestController.js";

const router = express.Router();

router.post(
"/:listingId",
protect,
authorize("tenant"),
sendInterest
);

router.patch(
"/:id",
protect,
authorize("owner"),
updateInterest
);

router.get(
"/owner",
protect,
authorize("owner"),
getOwnerInterests
);

router.get(
    "/my",
    protect,
    authorize("tenant"),
    getMyInterests
);

export default router;