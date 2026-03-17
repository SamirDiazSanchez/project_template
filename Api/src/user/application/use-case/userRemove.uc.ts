import type { IUserRepository } from "@/user/domain/repository-interface/user.repository.interface.js";
import { Uuid } from "@/shared/domain/value-object/uuid.vo.js";

export class UserRemove {
    constructor(
        private readonly userRepository: IUserRepository
    ) { }

    async run(
        id: string,
        recordBy: string
    ): Promise<void> {
        const userId = new Uuid(id);
        const userRecorderId = new Uuid(recordBy);
        await this.userRepository.remove(userId.value, userRecorderId.value);
    }
}