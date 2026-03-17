import type { NextFunction, Request, Response } from "express";
import { AppCredentialServiceContainer } from "./appCredentialServiceContainer.js";
import { createHash } from "node:crypto";

export class AppCredentialController {
    async listAll(req: Request, res: Response, _: NextFunction) {
        try {
            const pageNumber = parseInt(req.query.pageNumber as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;

            const { apps, totalRecords } = await AppCredentialServiceContainer.list.run(pageNumber, pageSize);

            res.status(200).json({
                totalRecords,
                data: apps.map(app => ({
                    clientId: app.clientId.value,
                    appName: app.appName,
                    clientSecret: app.clientSecret,
                    isActive: app.isActive
                }))
            });
        } catch (error) {
            throw error;
        }
    }

    async save(req: Request, res: Response, _: NextFunction) {
        if (!req.body || !req.body.clientSecret || !req.body.appName) {
            res.status(400).json({ error: "Parameter is required" });
            return;
        }

        const recordBy = (req as any).userId;

        try {
            const hashedSecret = createHash("sha256").update(req.body.clientSecret).digest("hex");

            await AppCredentialServiceContainer.save.run(req.body.clientId, hashedSecret, req.body.appName, recordBy);
            res.status(201).json({ message: "App credential saved successfully" });
        } catch (error) {
            throw error;
        }
    }

    async remove(req: Request, res: Response, _: NextFunction) {
        const clientId = req.params.id as string;
        const recordBy = (req as any).userId;

        if (!clientId) {
            res.status(400).json({ error: "clientId is required" });
            return;
        }

        try {
            await AppCredentialServiceContainer.remove.run(clientId, recordBy);
            res.status(204).send();
        } catch (error) {
            throw error;
        }
    }
}
