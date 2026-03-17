import type { User } from "@/user/domain/entities/user.entity.js";
import type { IUserRepository } from "@/user/domain/repository-interface/user.repository.interface.js";
import { Uuid } from "@/shared/domain/value-object/uuid.vo.js";
import { UserNotFoundError } from "@/user/domain/errors/userNotFound.error.js";

export class UserFindById {
    constructor(
        private readonly userRepository: IUserRepository
    ) { }

    async run(
        id: string
    ): Promise<User> {
        const userId = new Uuid(id);
        const user = await this.userRepository.findById(userId.value);
        if (!user) throw new UserNotFoundError();
        return user;
    }
}