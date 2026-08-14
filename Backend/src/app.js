import express from 'express'

 export const app = express()
 import {authRouter} from './routes/auth.route.js'
 import { workspaceRouter } from './routes/workspace.route.js'
 import cookieParser from 'cookie-parser'
 app.use(express.json())
 app.use(cookieParser())
 
 app.use('/api/auth' , authRouter)
 app.use('/api/workspace', workspaceRouter)
 
