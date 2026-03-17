import { User } from "@/user/domain/entities/user.entity.js";
import type { IUserRepository } from "@/user/domain/repository-interface/user.repository.interface.js";
import { UserEmail } from "@/user/domain/value-object/userEmail.vo.js";
import { Uuid } from "@/shared/domain/value-object/uuid.vo.js";
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
        recordBy: string
    ): Promise<void> {
        const userId = id ? new Uuid(id) : Uuid.create();
        const userEmail = new UserEmail(email);
        const userRecorderId = new Uuid(recordBy);
        const userRole = new UserRole(role);
        const user = new User(userId, userEmail, name, userRole);
        user.setRecordId(userRecorderId);
        await this.userRepository.save(user);
    }
}