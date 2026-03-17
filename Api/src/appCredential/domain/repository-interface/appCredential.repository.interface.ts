import { AppCredential } from "../entities/appCredential.entity.js";

export interface IAppCredentialRepository {
    findByClientId(clientId: string): Promise<AppCredential | null>;
    save(app: AppCredential, recordBy: string): Promise<void>;
    remove(clientId: string, recordBy: string): Promise<void>;
    listAll(pageNumber: number, pageSize: number): Promise<{ apps: AppCredential[], totalRecords: number }>;
}
