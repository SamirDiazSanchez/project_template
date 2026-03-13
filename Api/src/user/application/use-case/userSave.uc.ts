import { User } from "@/user/domain/entities/user.entity.js";
import type { IUserRepository } from "@/user/domain/repository-interface/user.repository.interface.js";
import { UserEmail } from "@/user/domain/value-object/userEmail.vo.js";
import { UserId } from "@/user/domain/value-object/userId.vo.js";
import { UserRole } from "@/user/domain/value-object/userRole.vo.js";

export class UserSave {
    constructor(
        private readonly userRepository: IUserRepository,
    ) { }

    async run(
        id: string | null,
        name: string,
        email: string,
        role: string,
        recorderId: string
    ): Promise<void> {
        const userId = id ? new UserId(id) : UserId.create();
        const userEmail = new UserEmail(email);
        const userRecorderId = new UserId(recorderId);
        const userRole = new UserRole(role);
        const user = new User(userId, userEmail, name, userRole);
        user.setRecordId(userRecorderId);
        await this.userRepository.save(user);
    }
}