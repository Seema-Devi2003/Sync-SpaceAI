 import http from 'http'
 import dotenv from 'dotenv'
 import {app} from './src/app.js'
 import { connectToDB } from './src/config/database.js'
 import {Server} from "socket.io"

 dotenv.config()

 connectToDB()
 const httpServer = http.createServer(app)
 const io = new Server(httpServer,{
    cors : {
        origin : "http://localhost:5173",
        credentials : true

    }
 })
 io.on("connection", (socket) =>{
    console.log("A user is connected:" , socket.id)
 
 socket.on("disconnect", ()=>{
    console.log(" user disconnected :", socket.id)

 })
})

httpServer.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})