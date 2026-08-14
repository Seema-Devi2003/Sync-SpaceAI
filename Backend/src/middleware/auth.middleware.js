import jwt from 'jsonwebtoken'
import {userModel} from '../models/user.model.js' 
 export async function authMiddleware(req, res, next){
    try{
    const token = req.cookies.accessToken
    if(!token){
        return res.status(401).json({
            message : "Unauthorized, Token not provided"
        })
    }
    
    
    
    let decoded = null
    try{
        decoded  =  await jwt.verify(token, process.env.JWT_SECRET)
    } 
    catch(err){
       return res.status(401).json({
            message : "Invalid or Expired Token"
        })
    }
    const user = await userModel.findById(decoded.id)
    if(!user){
        return res.status(401).json({
            message : "user no longer exists"
        })
    }
    req.user = user
    next()
}
catch(err){
    console.error("AuthMiddleware Error", err.message)
 res.status(500).json({
        message : "something went wrong"
    })
}
}