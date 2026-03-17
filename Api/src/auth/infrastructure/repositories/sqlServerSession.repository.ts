import sql from "mssql";
import { Session } from "@/auth/domain/entities/session.entity.js";
import { Uuid } from "@/shared/domain/value-object/uuid.vo.js";
import type { ISessionRepository } from "@/auth/domain/repository-interface/session.repository.interface.js";
import { SqlServerConnection } from "@/shared/infrastructure/database/sqlServer.connection.js";

export class SqlServerSessionRepository extends SqlServerConnection implements ISessionRepository {
    constructor() {
        super();
    }

    async save(session: Session): Promise<void> {
        try {
            const request = this.pool!.request();
            request.input('SessionId', sql.UniqueIdentifier, session.sessionId.value);
            request.input('UserId', sql.UniqueIdentifier, session.userId.value);
            request.input('SessionHash', sql.VarChar(64), session.sessionHash);

            request.output('StatusCode', sql.Int);
            request.output('StatusMessage', sql.VarChar(1000));

            const result = await request.execute('spSave_Session');

            const statusCode = result.output.StatusCode;
            const statusMessage = result.output.StatusMessage;

            if (statusCode !== 0) {
                throw new Error(`Error saving session: ${statusMessage} (Code: ${statusCode})`);
            }
        } catch (error) {
            throw error;
        }
    }

    async findByUserId(userId: string): Promise<Session | null> {
        try {
            const request = this.pool!.request();
            request.input('UserId', sql.UniqueIdentifier, userId);

            const result = await request.execute('spSelect_Session');
            const row = result.recordset[0];

            if (!row) return null;

            return this.mapToSession(row);
        } catch (error) {
            throw error;
        }
    }

    async remove(userId: string): Promise<void> {
        try {
            const request = this.pool!.request();
            request.input('UserId', sql.UniqueIdentifier, userId);

            request.output('StatusCode', sql.Int);
            request.output('StatusMessage', sql.VarChar(1000));

            const result = await request.execute('spRemove_Session');

            const statusCode = result.output.StatusCode;
            const statusMessage = result.output.StatusMessage;

            if (statusCode !== 0) {
                throw new Error(`Error removing session: ${statusMessage} (Code: ${statusCode})`);
            }
        } catch (error) {
            throw error;
        }
    }

    private mapToSession(row: any): Session {
        return new Session(
            new Uuid(row.SessionId),
            new Uuid(row.UserId),
            row.SessionHash,
            row.IsActive
        );
    }
}
