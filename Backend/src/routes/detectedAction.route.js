import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js';
import {getDetectedActionController} from '../controller/detectedActionController.js'
const detectedActionRouter = express.Router();

detectedActionRouter.get('/:workspaceId/detected-actions', authMiddleware, getDetectedActionController)
export {detectedActionRouter}