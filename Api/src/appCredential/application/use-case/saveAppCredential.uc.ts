import { Uuid } from "@/shared/domain/value-object/uuid.vo.js";
import { AppCredential } from "../../domain/entities/appCredential.entity.js";
import type { IAppCredentialRepository } from "../../domain/repository-interface/appCredential.repository.interface.js";

export class SaveAppCredential {
    constructor(private readonly appRepository: IAppCredentialRepository) { }

    async run(id: string | null, clientSecret: string, appName: string, recordBy: string): Promise<void> {
        const clietnId = id ? new Uuid(id) : Uuid.create();
        const app = new AppCredential(clietnId, clientSecret, appName);
        app.setRecordId(new Uuid(recordBy));
        await this.appRepository.save(app, recordBy);
    }
}
