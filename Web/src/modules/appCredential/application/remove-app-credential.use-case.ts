import type { IAppCredentialRepository } from "../domain/repositories/appCredential.repository.interface.ts";

export class RemoveAppCredentialUseCase {
    private repository: IAppCredentialRepository;
    
    constructor(repository: IAppCredentialRepository) { 
        this.repository = repository;
    }

    async execute(clientId: string) {
        return await this.repository.remove(clientId);
    }
}
