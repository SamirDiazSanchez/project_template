import type { UserId } from "../value-object/userId.vo.js";
import type { UserEmail } from "../value-object/userEmail.vo.js";
import { UserRole } from "../value-object/userRole.vo.js";

export class User {
    public recorderId?: UserId;
    public isActive?: boolean

    constructor(
        public readonly id: UserId,
        public readonly email: UserEmail,
        public name: string,
        public role: UserRole
    ) { }

    setRecordId(recordId: UserId): void {
        this.recorderId = recordId;
    }

    setIsActive(isActive: boolean): void {
        this.isActive = isActive;
    }

    setRole(role: UserRole): void {
        this.role = role;
    }
}