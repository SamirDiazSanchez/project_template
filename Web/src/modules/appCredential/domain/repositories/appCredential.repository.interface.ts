import type { AppCredential } from "../entities/appCredential.entity.ts";

export interface IAppCredentialRepository {
    listAll(pageNumber: number, pageSize: number): Promise<{ apps: AppCredential[], totalRecords: number }>;
    save(app: Partial<AppCredential>): Promise<void>;
    remove(clientId: string): Promise<void>;
}
