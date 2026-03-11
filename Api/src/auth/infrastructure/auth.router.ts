import Router from "express";
import { AuthController } from "./auth.controller.js";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/auth/login", authController.login);
authRouter.post("/auth/refresh", authController.refresh);

export {
    authRouter
}
