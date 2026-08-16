import express from 'express'
const workspaceRouter = express.Router();
import { getMyWorkSpaceController, getWorkspaceByIdController, memberInviteController, workspaceCreateController } from '../controller/workspace.controller.js';
import { authMiddleware } from "../middleware/auth.middleware.js";
workspaceRouter.post('/',authMiddleware, workspaceCreateController )
workspaceRouter.get('/',  authMiddleware, getMyWorkSpaceController )
workspaceRouter.get('/:workspaceId', authMiddleware, getWorkspaceByIdController)
workspaceRouter.post('/:workspaceId/members', authMiddleware, memberInviteController )
export {workspaceRouter}
