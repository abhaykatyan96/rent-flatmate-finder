import mongoose from "mongoose";

const tenantProfileSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requried: true,
        unique: true
    },
    preferredLocation: {
        type: String,
        required: true
    },
    minBudget: {
        type: Number,
        required: true
    },
    maxBudget: {
        type: Number,
        required: true
    },
    moveInDate: {
        type: Date,
        required: true
    }
},
{
    timestamps: true,
}
);

export default mongoose.model("TenantProfile", tenantProfileSchema);