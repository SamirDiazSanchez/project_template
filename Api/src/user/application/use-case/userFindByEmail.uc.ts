import type { User } from "@/user/domain/entities/user.entity.js";
import type { IUserRepository } from "@/user/domain/repository-interface/user.repository.interface.js";
import { UserEmail } from "@/user/domain/value-object/userEmail.vo.js";
import { UserNotFoundError } from "@/user/domain/errors/userNotFound.error.js";

export class UserFindByEmail {
    constructor(
        private readonly userRepository: IUserRepository
    ) { }

    async run(
        email: string
    ): Promise<User> {
        const userEmail = new UserEmail(email);
        const user = await this.userRepository.findByEmail(userEmail.value);
        if (!user) throw new UserNotFoundError();

        return user;
    }
}