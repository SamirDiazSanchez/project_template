import type { Request, Response, NextFunction } from "express";
import { AuthServiceContainer } from "./authServiceContainer.js";
import { InvalidCredentialsError } from "@/auth/domain/errors/invalidCredentials.error.js";

export class AuthController {
    async login(req: Request, res: Response, _: NextFunction) {
        if (!req.body || !req.body.email) {
            res.status(400).json({ error: "Parameter is required" });
            return;
        }

        try {
            const { accessToken, refreshToken } = await AuthServiceContainer.login.run(req.body.email);
            res.cookie("token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000 * 60 * 5
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000 * 60 * 15
            });
            res.status(200).json({ message: "Login successful" });
        } catch (error) {
            if (error instanceof InvalidCredentialsError) {
                res.status(401).json({ error: "Invalid credentials" });
                return;
            }
            throw error;
        }
    }

    async refresh(req: Request, res: Response, _: NextFunction) {
        const refreshTokenCookie = req.cookies.refreshToken;

        if (!refreshTokenCookie) {
            res.status(401).json({ error: "No refresh token provided" });
            return;
        }

        try {
            const { accessToken, refreshToken } = await AuthServiceContainer.refresh.run(refreshTokenCookie);
            res.cookie("token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000 * 60 * 5
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000 * 60 * 15
            });
            res.status(200).json({ message: "Token refreshed successfully" });
        } catch (error) {
            if (error instanceof InvalidCredentialsError) {
                res.status(401).json({ error: "Invalid refresh token" });
                return;
            }
            throw error;
        }
    }
}
