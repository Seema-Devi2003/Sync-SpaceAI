import express from "express"
import { createTaskController, getWorkspaceTasks, updateTaskStatusController, deleteTaskController } from "../controller/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const taskRouter = express.Router();
taskRouter.post('/:workspaceId/tasks', authMiddleware, createTaskController)
taskRouter.get("/:workspaceId/tasks", authMiddleware, getWorkspaceTasks)
taskRouter.patch('/:workspaceId/tasks/:taskId/status', authMiddleware, updateTaskStatusController)
taskRouter.delete("/:workspaceId/tasks/:taskId", authMiddleware, deleteTaskController)
export {taskRouter}