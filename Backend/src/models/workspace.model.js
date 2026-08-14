import mongoose from 'mongoose'
const workspaceSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true

    },
    description : {
        type : String, 
        default : "",

    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    }
}, {
    timestamps : true
})
 export const workspaceModel = mongoose.model("workspace" , workspaceSchema)