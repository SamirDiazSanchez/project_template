import type { IAppCredentialRepository } from "../../domain/repository-interface/appCredential.repository.interface.js";

export class RemoveAppCredential {
    constructor(private readonly appRepository: IAppCredentialRepository) { }

    async run(id: string, recordBy: string): Promise<void> {
        await this.appRepository.remove(id, recordBy);
    }
}
