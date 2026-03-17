import { Uuid } from "@/shared/domain/value-object/uuid.vo.js";

export class AppCredential {
    public recorderId?: Uuid;

    constructor(
        public readonly clientId: Uuid,
        public readonly clientSecret: string,
        public readonly appName: string,
        public readonly isActive: boolean = true,
    ) { }

    setRecordId(recorderId: Uuid): void {
        this.recorderId = recorderId;
    }
}
