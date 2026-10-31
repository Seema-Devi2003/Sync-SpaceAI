import mongoose from 'mongoose'
const messageSchema = new mongoose.Schema({
    workspace : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "workspace",
        required : true,
    },
    sender : {
type : mongoose.Schema.Types.ObjectId,
ref : "user",
required : true,
    },
    message : {
        type : String,
        required : true
    }
}, 
{timestamps : true})
 export const messageModel = mongoose.model("message", messageSchema)