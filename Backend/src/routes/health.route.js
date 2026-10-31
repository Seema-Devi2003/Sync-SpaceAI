
import express from 'express'
import {authMiddleware} from '../middleware/auth.middleware.js'
import { getHealthScoreController } from '../controller/health.controller.js'
const healthRouter = express.Router()
healthRouter.get('/:workspaceId/health-score', authMiddleware, getHealthScoreController)
export {healthRouter}