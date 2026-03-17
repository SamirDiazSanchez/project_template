import { createHash } from "node:crypto";
import type { IUserRepository } from "@/user/domain/repository-interface/user.repository.interface.js";
import type { IJwtService } from "@/auth/domain/services/jwt.service.interface.js";
import type { ISessionRepository } from "@/auth/domain/repository-interface/session.repository.interface.js";
import { UserEmail } from "@/user/domain/value-object/userEmail.vo.js";
import { InvalidCredentialsError } from "@/auth/domain/errors/invalidCredentials.error.js";
import { Session } from "@/auth/domain/entities/session.entity.js";
import { Uuid } from "@/shared/domain/value-object/uuid.vo.js";

export class AuthLogin {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly jwtService: IJwtService,
        private readonly sessionRepository: ISessionRepository
    ) { }

    async run(email: string): Promise<{ accessToken: string; refreshToken: string; role: string }> {
        const userEmail = new UserEmail(email);
        const user = await this.userRepository.findByEmail(userEmail.value);
        if (!user) throw new InvalidCredentialsError();

        const payload = {
            userId: user.userId.value,
            email: user.email.value,
            role: user.role.value
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.signRefresh(payload);

        // Save session in database
        const sessionHash = createHash("sha256").update(refreshToken).digest("hex");
        const session = new Session(
            Uuid.create(),
            user.userId,
            sessionHash
        );

        await this.sessionRepository.save(session);

        return { accessToken, refreshToken, role: user.role.value };
    }
}
