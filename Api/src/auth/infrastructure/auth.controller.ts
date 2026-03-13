import type { Request, Response, NextFunction } from "express";
import { AuthServiceContainer } from "./authServiceContainer.js";
import { InvalidCredentialsError } from "@/auth/domain/errors/invalidCredentials.error.js";
import { CookieSessionService } from "../../shared/infrastructure/services/cookie-session.service.js";

const sessionService = new CookieSessionService();

export class AuthController {
    async login(req: Request, res: Response, _: NextFunction) {
        if (!req.body || !req.body.email) {
            res.status(400).json({ error: "Parameter is required" });
            return;
        }

        try {
            const { accessToken, refreshToken, role } = await AuthServiceContainer.login.run(req.body.email);

            sessionService.setSession(res, "token", accessToken, { maxAge: 1000 * 60 * 5 });
            sessionService.setSession(res, "refreshToken", refreshToken, { maxAge: 1000 * 60 * 15 });

            res.status(200).json({ role });
        } catch (error) {
            if (error instanceof InvalidCredentialsError) {
                res.status(401).json({ error: "Authentication failed" });
                return;
            }
            throw error;
        }
    }

    async googleLogin(req: Request, res: Response, _: NextFunction) {
        if (!req.body || !req.body.idToken) {
            res.status(400).json({ error: "Parameter idToken is required" });
            return;
        }

        try {
            const { accessToken, refreshToken, role } = await AuthServiceContainer.googleLogin.run(req.body.idToken);

            sessionService.setSession(res, "token", accessToken, { maxAge: 1000 * 60 * 5 });
            sessionService.setSession(res, "refreshToken", refreshToken, { maxAge: 1000 * 60 * 15 });

            res.status(200).json({ role });
        } catch (error) {
            if (error instanceof InvalidCredentialsError) {
                res.status(401).json({ error: "Authentication failed" });
                return;
            }
            throw error;
        }
    }

    async refresh(req: Request, res: Response, _: NextFunction) {
        const refreshToken = sessionService.getSession(req, "refreshToken");

        if (!refreshToken) {
            res.status(401).json({ error: "No refresh token provided" });
            return;
        }

        try {
            const { accessToken, refreshToken: newRefreshToken } = await AuthServiceContainer.refresh.run(refreshToken);

            sessionService.setSession(res, "token", accessToken, { maxAge: 1000 * 60 * 5 });
            sessionService.setSession(res, "refreshToken", newRefreshToken, { maxAge: 1000 * 60 * 15 });

            res.status(200).json({ message: "Token refreshed successfully" });
        } catch (error) {
            if (error instanceof InvalidCredentialsError) {
                res.status(401).json({ error: "Authentication failed" });
                return;
            }
            throw error;
        }
    }

    async logout(_: Request, res: Response, __: NextFunction) {
        sessionService.clearSession(res, "token");
        sessionService.clearSession(res, "refreshToken");
        res.status(200).json({ message: "Logout successful" });
    }
}
