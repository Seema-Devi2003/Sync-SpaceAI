import express from 'express'
const messageRouter = express.Router()
import { authMiddleware } from '../middleware/auth.middleware.js'
import { getWorkspaceMessageController } from '../controller/message.controller.js'
messageRouter.get("/:workspaceId/messages", authMiddleware, getWorkspaceMessageController)
export {messageRouter}