import express from 'express'

 export const app = express()
 import {authRouter} from './routes/auth.route.js'
 import { workspaceRouter } from './routes/workspace.route.js'
 import { taskRouter } from './routes/task.route.js'
 import { messageRouter } from './routes/message.route.js'
 import { detectedActionRouter } from './routes/detectedAction.route.js'
 import { aiRouter } from './routes/ai.route.js'
 import cookieParser from 'cookie-parser'
 app.use(express.json())
 app.use(cookieParser())
 
 app.use('/api/auth' , authRouter)
 app.use('/api/workspace', workspaceRouter)
 app.use('/api/task', taskRouter)
 app.use('/api/message', messageRouter)
 app.use('/api/workspace', detectedActionRouter)
 app.use('/api/workspace', aiRouter)
