import type { Request, Response, NextFunction } from "express";
import { JwtService } from "../../auth/infrastructure/services/jwt.service.js";
import { AESCryptoService } from "../infrastructure/services/aes-crypto.service.js";

const jwtService = new JwtService();
const cryptoService = new AESCryptoService();

export const authMiddleware = (allowedRoles: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const encryptedToken = req.cookies.token;

        if (!encryptedToken) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

        const token = cryptoService.decrypt(encryptedToken);
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
