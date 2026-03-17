import type { Uuid } from "@/shared/domain/value-object/uuid.vo.js";
import type { UserEmail } from "../value-object/userEmail.vo.js";
import { UserRole } from "../value-object/userRole.vo.js";

export class User {
    public recorderId?: Uuid;

    constructor(
        public readonly userId: Uuid,
        public readonly email: UserEmail,
        public readonly userName: string,
        public readonly role: UserRole,
        public readonly isActive: boolean = true,
    ) { }

    setRecordId(recordId: Uuid): void {
        this.recorderId = recordId;
    }
}