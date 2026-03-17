import sql from "mssql";
import { AppCredential } from "../../domain/entities/appCredential.entity.js";
import type { IAppCredentialRepository } from "../../domain/repository-interface/appCredential.repository.interface.js";
import { SqlServerConnection } from "../../../shared/infrastructure/database/sqlServer.connection.js";
import { Uuid } from "@/shared/domain/value-object/uuid.vo.js";

export class SqlServerAppCredentialRepository extends SqlServerConnection implements IAppCredentialRepository {
    constructor() {
        super();
    }

    async findByClientId(clientId: string): Promise<AppCredential | null> {
        try {
            const request = this.pool!.request();
            request.input('ClientId', sql.UniqueIdentifier, clientId);
            request.output('TotalRecords', sql.Int);

            const result = await request.execute('spSelect_AppCredential');
            const row = result.recordset[0];

            if (!row) return null;

            return this.mapToApp(row);
        } catch (error) {
            throw error;
        }
    }

    async save(app: AppCredential, recordBy: string): Promise<void> {
        try {
            const request = this.pool!.request();
            request.input('ClientId', sql.UniqueIdentifier, app.clientId.value);
            request.input('AppName', sql.VarChar(200), app.appName);
            request.input('ClientSecret', sql.VarChar(64), app.clientSecret);
            request.input('RecordBy', sql.UniqueIdentifier, recordBy);

            request.output('StatusCode', sql.Int);
            request.output('StatusMessage', sql.VarChar(1000));

            const result = await request.execute('spSave_AppCredebtial');

            const statusCode = result.output.StatusCode;
            const statusMessage = result.output.StatusMessage;

            if (statusCode !== 0) {
                throw new Error(`Error saving app credential: ${statusMessage} (Code: ${statusCode})`);
            }
        } catch (error) {
            throw error;
        }
    }

    async remove(clientId: string, recordBy: string): Promise<void> {
        try {
            const request = this.pool!.request();
            request.input('ClientId', sql.UniqueIdentifier, clientId);
            request.input('RecordBy', sql.UniqueIdentifier, recordBy);

            request.output('StatusCode', sql.Int);
            request.output('StatusMessage', sql.VarChar(1000));

            const result = await request.execute('spRemove_AppCredential');

            const statusCode = result.output.StatusCode;
            const statusMessage = result.output.StatusMessage;

            if (statusCode !== 0) {
                throw new Error(`Error removing app credential: ${statusMessage} (Code: ${statusCode})`);
            }
        } catch (error) {
            throw error;
        }
    }

    async listAll(pageNumber: number, pageSize: number): Promise<{ apps: AppCredential[], totalRecords: number }> {
        try {
            const request = this.pool!.request();
            request.input('PageNumber', sql.Int, pageNumber);
            request.input('PageSize', sql.Int, pageSize);
            request.output('TotalRecords', sql.Int);

            const result = await request.execute('spSelect_AppCredential');
            const rows = result.recordset;
            const totalRecords = result.output.TotalRecords || 0;

            return {
                apps: rows.map((row: any) => this.mapToApp(row)),
                totalRecords
            };
        } catch (error) {
            throw error;
        }
    }

    private mapToApp(row: any): AppCredential {
        return new AppCredential(
            new Uuid(row.ClientId),
            row.ClientSecret,
            row.UserName,
            row.IsActive
        );
    }
}
