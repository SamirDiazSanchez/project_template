import type { AppCredential } from "../domain/entities/appCredential.entity.ts";
import type { IAppCredentialRepository } from "../domain/repositories/appCredential.repository.interface.ts";

export class SaveAppCredentialUseCase {
    private repository: IAppCredentialRepository;

    constructor(repository: IAppCredentialRepository) { 
        this.repository = repository;
    }

    async execute(app: Partial<AppCredential>) {
        return await this.repository.save(app);
    }
}
