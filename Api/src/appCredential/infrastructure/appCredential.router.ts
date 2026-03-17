import { Router } from "express";
import { AppCredentialController } from "./appCredential.controller.js";
import { authMiddleware } from "@/shared/middlewares/auth.middleware.js";

const appCredentialRouter = Router();
const appCredentialController = new AppCredentialController();

appCredentialRouter.get("/appCredential", authMiddleware(['admin']), appCredentialController.listAll);
appCredentialRouter.post("/appCredential", authMiddleware(['admin']), appCredentialController.save);
appCredentialRouter.delete("/appCredential/:id", authMiddleware(['admin']), appCredentialController.remove);

export {
    appCredentialRouter
};
