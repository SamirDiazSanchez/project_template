import type { Request, Response, NextFunction } from "express";
import { JwtService } from "../../auth/infrastructure/services/jwt.service.js";
import { CookieSessionService } from "../infrastructure/services/cookie-session.service.js";

const jwtService = new JwtService();
const sessionService = new CookieSessionService();

export const authMiddleware = (allowedRoles: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = sessionService.getSession(req, "token");

        if (!token) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

        const payload = jwtService.verify(token) as any;

        if (!payload) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }

        (req as any).userId = payload.userId;

        next();
    };
};

