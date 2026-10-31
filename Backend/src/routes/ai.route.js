import {Router} from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { askProjectController } from '../controller/ai.controller.js';
const aiRouter = Router();
aiRouter.post('/:workspaceId/ask' , authMiddleware, askProjectController)
export {aiRouter}
