import Router from "express";
import { UserController } from "./user.controller.js";
import { authMiddleware } from "@/auth/infrastructure/middlewares/auth.middleware.js";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/user", authMiddleware(["admin"]), userController.listAll);
userRouter.get("/user/:id", authMiddleware(["admin"]), userController.findById);
userRouter.get("/user/:email", authMiddleware(["admin"]), userController.findByEmail);
userRouter.post("/user", authMiddleware(["admin"]), userController.save);
userRouter.delete("/user/:id", authMiddleware(["admin"]), userController.remove);

export {
    userRouter
}