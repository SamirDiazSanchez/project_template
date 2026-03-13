import type { Response, Request } from "express";
import CryptoJS from "crypto-js";
import type { ISessionService, CookieOptions } from "../../domain/services/session.service.interface.js";
import { AESCryptoService } from "./aes-crypto.service.js";

export class CookieSessionService implements ISessionService {
    private readonly cryptoService: AESCryptoService;
    private readonly secretKey: string;

    constructor() {
        this.cryptoService = new AESCryptoService();
        this.secretKey = process.env.VITE_CRYPTO_KEY!;
    }

    private getHashedKey(key: string): string {
        // Use a deterministic hash for the cookie name so we can find it consistently
        // but it remains "obfuscated"/encrypted in the browser.
        return CryptoJS.HmacSHA256(key, this.secretKey).toString(CryptoJS.enc.Hex);
    }

    setSession(res: Response, key: string, value: string, options?: CookieOptions): void {
        const hashedKey = this.getHashedKey(key);
        const encryptedValue = this.cryptoService.encrypt(value);

        res.cookie(hashedKey, encryptedValue, {
            ...options,
            httpOnly: options?.httpOnly ?? true,
            secure: options?.secure ?? process.env.NODE_ENV === "production",
            sameSite: options?.sameSite ?? "strict"
        });
    }

    getSession(req: Request, key: string): string | null {
        const hashedKey = this.getHashedKey(key);
        const encryptedValue = req.cookies?.[hashedKey];

        if (!encryptedValue) return null;

        return this.cryptoService.decrypt(encryptedValue);
    }

    clearSession(res: Response, key: string): void {
        const hashedKey = this.getHashedKey(key);
        res.clearCookie(hashedKey);
    }
}

