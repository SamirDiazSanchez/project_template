import type { IJwtService } from "@/auth/domain/services/jwt.service.interface.js";
import { InvalidCredentialsError } from "@/auth/domain/errors/invalidCredentials.error.js";

export class AuthRefresh {
    constructor(private readonly jwtService: IJwtService) { }

    async run(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = this.jwtService.verifyRefresh(refreshToken) as any;
        if (!payload || !payload.id || !payload.email || !payload.role) {
            throw new InvalidCredentialsError();
        }

        const newPayload = {
            id: payload.id,
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
