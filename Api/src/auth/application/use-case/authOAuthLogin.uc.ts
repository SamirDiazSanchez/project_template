import { createHash } from "node:crypto";
import type { IAppCredentialRepository } from "../../../appCredential/domain/repository-interface/appCredential.repository.interface.js";
import type { IJwtService } from "@/auth/domain/services/jwt.service.interface.js";
import { InvalidCredentialsError } from "@/auth/domain/errors/invalidCredentials.error.js";

export class AuthOAuthLogin {
    constructor(
        private readonly appRepository: IAppCredentialRepository,
        private readonly jwtService: IJwtService
    ) { }

    async run(clientId: string, clientSecret: string): Promise<{ accessToken: string }> {
        const app = await this.appRepository.findByClientId(clientId);

        if (!app || !app.isActive) {
            throw new InvalidCredentialsError();
        }

        // Verify secret (assuming it's stored as a SHA-256 hash or similar)
        const hashedSecret = createHash("sha256").update(clientSecret).digest("hex");
        if (app.clientSecret !== hashedSecret) {
            throw new InvalidCredentialsError();
        }

        const payload = {
            userId: app.clientId,
            email: app.appName, // App name acts as identifier
            role: "app"
        };

        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }
}
