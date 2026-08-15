import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
{
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    listing:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Listing",
        required:true
    },

    message:{
        type:String,
        required:true
    }

},
{
    timestamps:true
}
);

export default mongoose.model("Chat",chatSchema);