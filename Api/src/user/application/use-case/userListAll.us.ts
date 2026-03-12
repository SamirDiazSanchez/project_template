import type { User } from "@/user/domain/entities/user.entity.js";
import type { IUserRepository } from "@/user/domain/repository-interface/user.repository.interface.js";

export class UserListAll {
    constructor(
        private readonly userRepository: IUserRepository
    ) { }

    async run(pageNumber: number, pageSize: number): Promise<User[]> {
        return await this.userRepository.listAll(pageNumber, pageSize);
    }
}