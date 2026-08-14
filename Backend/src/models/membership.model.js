import mongoose from "mongoose";
const membershipSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    workspace : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "workspace",
        required : true
    },
    role : {
        type : String,
        enum : ["admin", "member"],
        default : "member"
    }
}, {
    timestamps : true
})
membershipSchema.index({user : 1 , workspace : 1}, {unique : true})
 export const membershipModel = mongoose.model("membership", membershipSchema)