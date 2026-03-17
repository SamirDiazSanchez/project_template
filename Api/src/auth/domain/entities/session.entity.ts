import type { Uuid } from "@/shared/domain/value-object/uuid.vo.js";

export class Session {
    constructor(
        public readonly sessionId: Uuid,
        public readonly userId: Uuid,
        public readonly sessionHash: string,
        public readonly isActive: boolean = true
    ) { }
}
