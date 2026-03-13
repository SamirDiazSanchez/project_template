import { OAuth2Client } from 'google-auth-library';
import type { IUserRepository } from "@/user/domain/repository-interface/user.repository.interface.js";
import type { IJwtService } from "@/auth/domain/services/jwt.service.interface.js";
import { InvalidCredentialsError } from "@/auth/domain/errors/invalidCredentials.error.js";

const client = new OAuth2Client();

export class AuthGoogleLogin {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly jwtService: IJwtService
    ) { }

    async run(idToken: string): Promise<{ accessToken: string; refreshToken: string; role: string }> {
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID!,
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) throw new InvalidCredentialsError();

            const email = payload.email;
            const user = await this.userRepository.findByEmail(email);

            if (!user) {
                throw new InvalidCredentialsError();
            }

            const jwtPayload = {
                userId: user.userId.value,
                email: user.email.value,
                role: user.role.value
            };
            const accessToken = this.jwtService.sign(jwtPayload);
            const refreshToken = this.jwtService.signRefresh(jwtPayload);

            return { accessToken, refreshToken, role: user.role.value };
        } catch (error) {
            console.error('Google verification failed', error);
            throw new InvalidCredentialsError();
        }
    }
}
