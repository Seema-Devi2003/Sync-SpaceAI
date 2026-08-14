  import { userModel } from "../models/user.model.js";
  import jwt from 'jsonwebtoken'
  import bcrypt from 'bcryptjs'
  import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
   export async function registerController(req, res){
    try{
    const {username, email, password} = req.body
    const isUserAlreadyExist = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
     if(isUserAlreadyExist){
        return res.status(409).json({
            message : "user is already exist " + (isUserAlreadyExist.email === email ? " with this email" : "with this username")

        })
     }
     const hashPassword = await bcrypt.hash(password, 10)
     const user = await userModel.create({
        username,
        email,
        password : hashPassword
     })

    const accessToken = generateAccessToken(user._id, user.email)
    const refreshToken = generateRefreshToken(user._id, user.email)
     user.refreshToken = refreshToken // token saved in database
     await user.save()
res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000  
})

     res.cookie("refreshToken", refreshToken,{
        httpOnly : true,
        secure : process.env.NODE_ENV === 'development',
        sameSite : "strict",
        maxAge : 7* 24 * 60 * 60 * 1000
     })
     res.status(201).json({
        message : "User registered Successfully",
        user : {
            username : username,
            email : user.email
        },
        accessToken
     })
    }
    catch(err){
        console.error("Register Error" , err.message)
        res.status(500).json({
            message : "something went wrong, please try again"
        })
    }

  }




   export async function loginController(req, res){
    try{
     const {username, email, password} = req.body
    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    }).select("+password")

      if(!user){
        return res.status(401).json({
            message : "Invalid email and password"

        })
     }
     const isPassword = await bcrypt.compare(password, user.password)
     if (!isPassword) {
    return res.status(401).json({
        message: "Invalid email and password"
    });
}
    

     const accessToken = await generateAccessToken(user._id, user.email)
     const refreshToken = await generateRefreshToken(user._id, user.email)
     user.refreshToken = refreshToken // token saved in database
     await user.save()
     res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000 
})

     res.cookie("refreshToken", refreshToken,  {
        httpOnly : true,
        secure : process.env.NODE_ENV === "Production",
        sameSite : "strict",
        maxAge : 7 * 24 * 60 * 60 * 1000,
     })
     res.status(200).json({
        message : "User login Successfully",
        user : {
            username : username,
            email : user.email
        },
        accessToken
     })

    }
    catch(err){
        console.error("Login Error" , err.message);
        res.status(500).json({
            message : "Something went wrong, please try again"
        })
    }

   }



   export async function getMeController(req, res){
    try{
    res.status(200).json({
        user : {
            username : req.user.username,
            email : req.user.email
        }
    })
}catch(err){
    console.error("get-me Error", err.message)
    res.status(500).json({
        message : "Something went wrong!"})
}
   }



   export async function refreshController(req, res) {
  try {
    const token = req.cookies.refreshToken

    if (!token) {
      return res.status(401).json({ message: "No refresh token, please login again" })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (err) {
      return res.status(401).json({ message: "Refresh token invalid or expired, please login again" })
    }

    const user = await userModel.findById(decoded.id).select("+refershToken")
   if (!user || user.refreshToken !== token) {
  return res.status(401).json({ message: "Refresh token invalid, please login again" })
}

    const newAccessToken = generateAccessToken(user._id, user.email)

    res.status(200).json({
      accessToken: newAccessToken
    })
  } catch (err) {
    console.error("Refresh Error", err.message)
    res.status(500).json({ message: "Something went wrong" })
  }
}
  
   
   export async function logoutController(req, res){
    try{
        const token = req.cookies.refreshToken
        if(token){
            await userModel.findOneAndUpdate({
         refreshToken : token}, 
        {refreshToken : null}
    )
        }
        res.clearCookie("refreshToken", {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "strict",
        })
        res.status(200).json({
             message: "Logged out successfully" 
            })
  } 
  catch (err) {
    console.error("Logout Error", err.message)
    res.status(500).json({ 
        message: "Something went wrong" 
    })
  }
}
   