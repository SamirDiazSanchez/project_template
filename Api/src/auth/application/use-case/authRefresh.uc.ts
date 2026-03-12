import type { IJwtService } from "@/auth/domain/services/jwt.service.interface.js";
import { InvalidCredentialsError } from "@/auth/domain/errors/invalidCredentials.error.js";

export class AuthRefresh {
    constructor(private readonly jwtService: IJwtService) { }

    async run(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = this.jwtService.verifyRefresh(refreshToken) as any;
        if (!payload || !payload.userId || !payload.email || !payload.role) {
            throw new InvalidCredentialsError();
        }

        const newPayload = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        };

        const newAccessToken = this.jwtService.sign(newPayload);
        const newRefreshToken = this.jwtService.signRefresh(newPayload);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }
}
