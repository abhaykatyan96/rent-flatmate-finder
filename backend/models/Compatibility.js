import mongoose from "mongoose";

const compatibilitySchema = new mongoose.Schema(
    {
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TenantProfile",
        required: true,
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    score: {
        type: Number,
        required: true
    },
    explanation: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
}
);

compatibilitySchema.index({ tenant: 1, listing: 1 }, { unique: true });

export default mongoose.model("Compatibility", compatibilitySchema);