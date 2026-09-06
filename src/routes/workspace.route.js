import express from 'express'
const workspaceRouter = express.Router();
import { changeRoleController, getMyWorkSpaceController, getWorkspaceByIdController, leaveWorkspaceController, memberInviteController, removeMemberController, workspaceCreateController } from '../controller/workspace.controller.js';
import { authMiddleware } from "../middleware/auth.middleware.js";
workspaceRouter.post('/',authMiddleware, workspaceCreateController )
workspaceRouter.get('/',  authMiddleware, getMyWorkSpaceController )
workspaceRouter.get('/:workspaceId', authMiddleware, getWorkspaceByIdController)
workspaceRouter.post('/:workspaceId/members', authMiddleware, memberInviteController )
workspaceRouter.delete('/:workspaceId/members/:memberId', authMiddleware, removeMemberController)
workspaceRouter.patch('/:workspaceId/members/:memberId/role', authMiddleware, changeRoleController)
workspaceRouter.delete('/:workspaceId/leave', authMiddleware, leaveWorkspaceController)
export {workspaceRouter}
