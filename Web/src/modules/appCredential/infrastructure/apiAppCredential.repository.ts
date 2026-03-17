import api from "../../../shared/infrastructure/services/api.service.ts";
import type { AppCredential } from "../domain/entities/appCredential.entity.ts";
import type { IAppCredentialRepository } from "../domain/repositories/appCredential.repository.interface.ts";

export class ApiAppCredentialRepository implements IAppCredentialRepository {
    async listAll(pageNumber: number, pageSize: number): Promise<{ apps: AppCredential[], totalRecords: number }> {
        const response = await api.get('/appCredential', {
            params: { pageNumber, pageSize }
        });
        return {
            apps: response.data.data,
            totalRecords: response.data.totalRecords
        };
    }

    async save(app: Partial<AppCredential>): Promise<void> {
        await api.post('/appCredential', app);
    }

    async remove(clientId: string): Promise<void> {
        await api.delete(`/appCredential/${clientId}`);
    }
}
