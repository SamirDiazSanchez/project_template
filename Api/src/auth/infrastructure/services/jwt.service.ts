import jwt from "jsonwebtoken";
import type { IJwtService } from "../../domain/services/jwt.service.interface.js";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "super-refresh-secret-key";

export class JwtService implements IJwtService {
    sign(payload: object, expiresIn: string | number = "1m"): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
    }

    signRefresh(payload: object, expiresIn: string | number = "7d"): string {
        return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn } as jwt.SignOptions);
    }

    verify(token: string): object | null {
        try {
            return jwt.verify(token, JWT_SECRET) as object;
        } catch (error) {
            return null;
        }
    }

    verifyRefresh(token: string): object | null {
        try {
            return jwt.verify(token, JWT_REFRESH_SECRET) as object;
        } catch (error) {
            return null;
        }
    }
}
