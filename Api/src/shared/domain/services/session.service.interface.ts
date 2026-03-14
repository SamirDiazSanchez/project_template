import type { Response, Request } from "express";

export interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    maxAge?: number;
}

export interface ISessionService {
    setSession(res: Response, key: string, value: string, options?: CookieOptions): void;
    getSession(req: Request, key: string): string | null;
    clearSession(res: Response, key: string): void;
}
