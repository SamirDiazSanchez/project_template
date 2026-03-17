import type { IAppCredentialRepository } from "../domain/repositories/appCredential.repository.interface.ts";

export class ListAppCredentialsUseCase {
    private repository: IAppCredentialRepository;
    
    constructor(repository: IAppCredentialRepository) { 
        this.repository = repository;
    }

    async execute(page: number, size: number) {
        return await this.repository.listAll(page, size);
    }
}
