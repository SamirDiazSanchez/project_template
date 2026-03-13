import type { Request, Response, NextFunction } from "express";
import { AuthServiceContainer } from "./authServiceContainer.js";
import { InvalidCredentialsError } from "@/auth/domain/errors/invalidCredentials.error.js";
import { AESCryptoService } from "../../shared/infrastructure/services/aes-crypto.service.js";

const cryptoService = new AESCryptoService();

export class AuthController {
    async login(req: Request, res: Response, _: NextFunction) {
        if (!req.body || !req.body.email) {
            res.status(400).json({ error: "Parameter is required" });
            return;
        }

        try {
            const { accessToken, refreshToken, role } = await AuthServiceContainer.login.run(req.body.email);

            const encryptedAccessToken = cryptoService.encrypt(accessToken);
            const encryptedRefreshToken = cryptoService.encrypt(refreshToken);

            res.cookie("token", encryptedAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000 * 60 * 5
            });
            res.cookie("refreshToken", encryptedRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000 * 60 * 15
            });
            res.status(200).json({ role: cryptoService.encrypt(role) });
        } catch (error) {
            if (error instanceof InvalidCredentialsError) {
                res.status(401).json({ error: "Invalid credentials" });
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

            const encryptedAccessToken = cryptoService.encrypt(accessToken);
            const encryptedRefreshToken = cryptoService.encrypt(refreshToken);

            res.cookie("token", encryptedAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000 * 60 * 5
            });
            res.cookie("refreshToken", encryptedRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000 * 60 * 15
            });
            res.status(200).json({ role: cryptoService.encrypt(role) });
        } catch (error) {
            if (error instanceof InvalidCredentialsError) {
                res.status(401).json({ error: "Invalid Google token or account not linked" });
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
            const decryptedRefreshToken = cryptoService.decrypt(refreshTokenCookie);
            const { accessToken, refreshToken } = await AuthServiceContainer.refresh.run(decryptedRefreshToken);

            const encryptedAccessToken = cryptoService.encrypt(accessToken);
            const encryptedRefreshToken = cryptoService.encrypt(refreshToken);

            res.cookie("token", encryptedAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000 * 60 * 5
            });
            res.cookie("refreshToken", encryptedRefreshToken, {
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

    async logout(_: Request, res: Response, __: NextFunction) {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logout successful" });
    }
}
