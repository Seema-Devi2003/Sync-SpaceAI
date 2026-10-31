import mongoose from "mongoose";
const detectedActionSchema = new mongoose.Schema({
    action : {
        type : String,
        enum : ["commitment", "decision", "blocker"],
     required : true
    },
    workspace : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "workspace",
        required : true

    },
    summary : {
        type : String,
        required : true
    },
    message : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "message",
        required : true,
        
    },
    createdBy :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    }

},
{
    timestamps: true
})

 export const detectedActionModel = mongoose.model("detectedaction", detectedActionSchema)