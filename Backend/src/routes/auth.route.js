
import express from "express";
import { registerController, loginController, getMeController, refreshController, logoutController } from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post('/login', loginController);
authRouter.get('/get-me', authMiddleware, getMeController)
authRouter.post('/refresh' , refreshController)
authRouter.post("/logout", logoutController)

export { authRouter };

