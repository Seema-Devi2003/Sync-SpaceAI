import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : [true, "username is already exist "],
        required : [true, "username is required"]
    },
    email : {
        type : String,
        unique : [true, "Email is already exist"],
        required : [true, "Email is required"]
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        select : false
    },
    refreshToken : {
        type : String,
        select : false
    }
})

 export const userModel = mongoose.model("user", userSchema)