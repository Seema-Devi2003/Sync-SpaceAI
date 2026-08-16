import express from "express"
import { createTaskController, getWorkspaceTasks } from "../controller/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const taskRouter = express.Router();
taskRouter.post('/:workspaceId/tasks', authMiddleware, createTaskController)
taskRouter.get("/:workspaceId/tasks", authMiddleware, getWorkspaceTasks)
export {taskRouter}