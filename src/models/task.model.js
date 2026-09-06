import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    description : {
        type : String
    },
    status : {
        type : String,
        enum : ["To-Do", "In-Progress", "completed"],
        default : "To-Do"

    },
    workspace : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "workspace",
        required: true
    },
    assignedTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",

    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    priority : {
        type : String,
        enum : ["low", "medium", "high"],
        default : "medium"
    }

}, {
    timestamps : true
})
 export const taskModel = mongoose.model("task", taskSchema)