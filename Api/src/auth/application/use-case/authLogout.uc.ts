import type { ISessionRepository } from "@/auth/domain/repository-interface/session.repository.interface.js";
import type { IJwtService } from "@/auth/domain/services/jwt.service.interface.js";

export class AuthLogout {
    constructor(
        private readonly jwtService: IJwtService,
        private readonly sessionRepository: ISessionRepository
    ) { }

    async run(refreshToken: string): Promise<void> {
        const payload = this.jwtService.verifyRefresh(refreshToken) as any;
        if (payload && payload.userId) {
            await this.sessionRepository.remove(payload.userId);
        }
    }
}
