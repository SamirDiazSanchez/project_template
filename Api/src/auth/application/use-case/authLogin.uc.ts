import type { IUserRepository } from "@/user/domain/repository-interface/user.repository.interface.js";
import type { IJwtService } from "@/auth/domain/services/jwt.service.interface.js";
import { UserEmail } from "@/user/domain/value-object/userEmail.vo.js";
import { InvalidCredentialsError } from "@/auth/domain/errors/invalidCredentials.error.js";

export class AuthLogin {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly jwtService: IJwtService
    ) { }

    async run(email: string): Promise<{ accessToken: string; refreshToken: string }> {
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
        return { accessToken, refreshToken };
    }
}
