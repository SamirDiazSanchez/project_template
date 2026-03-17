import { createHash } from "node:crypto";
import type { IJwtService } from "@/auth/domain/services/jwt.service.interface.js";
import type { ISessionRepository } from "@/auth/domain/repository-interface/session.repository.interface.js";
import { InvalidCredentialsError } from "@/auth/domain/errors/invalidCredentials.error.js";

export class AuthRefresh {
    constructor(
        private readonly jwtService: IJwtService,
        private readonly sessionRepository: ISessionRepository
    ) { }

    async run(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = this.jwtService.verifyRefresh(refreshToken) as any;
        if (!payload || !payload.userId || !payload.email || !payload.role) {
            throw new InvalidCredentialsError();
        }

        // Validate active session
        const session = await this.sessionRepository.findByUserId(payload.userId);
        if (!session) {
            throw new InvalidCredentialsError();
        }

        const currentHash = createHash("sha256").update(refreshToken).digest("hex");
        if (session.sessionHash !== currentHash) {
            throw new InvalidCredentialsError();
        }

        const newPayload = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        };

        const newAccessToken = this.jwtService.sign(newPayload);

        return {
            accessToken: newAccessToken,
            refreshToken: refreshToken
        };
    }
}
