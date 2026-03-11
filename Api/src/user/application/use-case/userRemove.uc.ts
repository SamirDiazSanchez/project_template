import type { IUserRepository } from "@/user/domain/repository-interface/user.repository.interface.js";
import { UserId } from "@/user/domain/value-object/userId.vo.js";

export class UserRemove {
    constructor(
        private readonly userRepository: IUserRepository
    ) { }

    async run(
        id: string,
        recorderId: string
    ): Promise<void> {
        const userId = new UserId(id);
        const userRecorderId = new UserId(recorderId);
        await this.userRepository.remove(userId.value, userRecorderId.value);
    }
}