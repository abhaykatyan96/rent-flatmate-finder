import mongoose from "mongoose";

const interestSchema = new mongoose.Schema(
{
    tenant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    listing:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Listing",
        required:true
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    compatibility:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Compatibility"
    },

    status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending"
    }

},
{
    timestamps:true
}
);

export default mongoose.model("Interest",interestSchema);