import { UserNotFoundError } from "@/user/domain/errors/userNotFound.error.js";
import { UserId } from "@/user/domain/value-object/userId.vo.js";
import { UserServiceContainer } from "@/user/infrastructure/userServiceContainer.js";
import type { Request, Response, NextFunction } from "express";

export class UserController {
    async listAll(_: Request, res: Response, __: NextFunction) {
        try {
            const users = await UserServiceContainer.listAll.run();
            if (users.length === 0) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            res.status(200).json(users.map(user => ({ id: user.id.value, name: user.name, email: user.email.value, role: user.role.value })));
        } catch (error) {
            if (error instanceof UserNotFoundError) return res.status(404).json({ error: "User not found" });

            throw error;
        }
    }

    async findById(req: Request, res: Response, _: NextFunction) {
        const _id = req.params.id as string;
        if (!_id) {
            res.status(400).json({ error: "Parameter is required" });
            return;
        }

        try {
            const user = await UserServiceContainer.findById.run(_id);
            res.status(200).json({ id: user.id.value, name: user.name, email: user.email.value, role: user.role.value });
        } catch (error) {
            if (error instanceof UserNotFoundError) return res.status(404).json({ error: "User not found" });

            throw error;
        }
    }

    async findByEmail(req: Request, res: Response, _: NextFunction) {
        const email = req.params.email as string;
        if (!email) {
            res.status(400).json({ error: "Parameter is required" });
            return;
        }

        try {
            const user = await UserServiceContainer.findByEmail.run(email);
            res.status(200).json({ id: user.id.value, name: user.name, email: user.email.value, role: user.role.value });
        } catch (error) {
            if (error instanceof UserNotFoundError) return res.status(404).json({ error: "User not found" });

            throw error;
        }
    }

    async save(req: Request, res: Response, _: NextFunction) {
        if (!req.body || !req.body.name || !req.body.email || !req.body.role) {
            res.status(400).json({ error: "Parameter is required" });
            return;
        }

        const recorderId = UserId.create().value;

        try {
            await UserServiceContainer.save.run(req.body.name, req.body.email, req.body.role, recorderId);
            res.status(201).send();
        } catch (error) {
            throw error;
        }
    }

    async remove(req: Request, res: Response, _: NextFunction) {
        const _id = req.params.id as string;
        if (!_id) {
            res.status(400).json({ error: "Id is required" });
            return;
        }

        const recorderId = UserId.create().value;

        try {
            await UserServiceContainer.remove.run(_id, recorderId);
            res.status(204).send();
        } catch (error) {
            throw error;
        }
    }
}