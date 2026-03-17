import type { IAppCredentialRepository } from "../../domain/repository-interface/appCredential.repository.interface.js";
import { AppCredential } from "../../domain/entities/appCredential.entity.js";

export class ListAppCredentials {
    constructor(private readonly appRepository: IAppCredentialRepository) { }

    async run(pageNumber: number, pageSize: number): Promise<{ apps: AppCredential[], totalRecords: number }> {
        return await this.appRepository.listAll(pageNumber, pageSize);
    }
}
