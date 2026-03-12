import sql from "mssql";
import { User } from "@/user/domain/entities/user.entity.js";
import { UserId } from "@/user/domain/value-object/userId.vo.js";
import { UserEmail } from "@/user/domain/value-object/userEmail.vo.js";
import type { IUserRepository } from "@/user/domain/repository-interface/user.repository.interface.js";
import { UserRole } from "@/user/domain/value-object/userRole.vo.js";
import { SqlServerConnection } from "@/shared/infrastructure/database/sqlServer.connection.js";

export class SqlServerUserRepository extends SqlServerConnection implements IUserRepository {
    constructor() {
        super();
    }

    async save(user: User): Promise<void> {
        try {
            const request = this.pool!.request();
            request.input('UserId', sql.UniqueIdentifier, user.userId.value);
            request.input('UserName', sql.VarChar(500), user.userName);
            request.input('Email', sql.VarChar(200), user.email.value);
            request.input('Role', sql.VarChar(100), user.role.value);
            request.input('RecordBy', sql.UniqueIdentifier, user.recorderId?.value);

            request.output('StatusCode', sql.Int);
            request.output('StatusMessage', sql.VarChar(1000));

            const result = await request.execute('spSave_User');

            const statusCode = result.output.StatusCode;
            const statusMessage = result.output.StatusMessage;

            if (statusCode !== 0) throw new Error(`Error saving user: ${statusMessage} (Code: ${statusCode})`);
        } catch (error) {
            throw error;
        }
    }

    async findById(id: string): Promise<User | null> {
        const request = this.pool!.request();
        request.input('UserId', sql.UniqueIdentifier, id);
        request.output('TotalRecords', sql.Int);

        const result = await request.execute('spSelect_User');
        const row = result.recordset[0];

        if (!row) return null;

        return this.mapToUser(row);
    }

    async findByEmail(email: string): Promise<User | null> {
        const request = this.pool!.request();
        request.input('Email', sql.VarChar(200), email);
        request.output('TotalRecords', sql.Int);

        const result = await request.execute('spSelect_User');
        const row = result.recordset[0];

        if (!row) return null;

        return this.mapToUser(row);
    }

    async listAll(pageNumber: number, pageSize: number): Promise<User[]> {
        const request = this.pool!.request();
        request.input('PageNumber', sql.Int, pageNumber);
        request.input('PageSize', sql.Int, pageSize);
        request.output('TotalRecords', sql.Int);

        const result = await request.execute('spSelect_User');
        const rows = result.recordset;

        return rows.map((row: any) => this.mapToUser(row));
    }

    async remove(id: string): Promise<void> {
        const request = this.pool!.request();
        request.input('UserId', sql.UniqueIdentifier, id);
        request.input('RecordBy', sql.UniqueIdentifier, id);

        request.output('StatusCode', sql.Int);
        request.output('StatusMessage', sql.VarChar(1000));

        const result = await request.execute('spRemove_User');

        const statusCode = result.output.StatusCode;
        const statusMessage = result.output.StatusMessage;

        if (statusCode !== 0) throw new Error(`Error removing user: ${statusMessage} (Code: ${statusCode})`);
    }

    private mapToUser(row: any): User {
        const user = new User(
            new UserId(row.UserId),
            new UserEmail(row.Email),
            row.UserName,
            new UserRole(row.Role)
        );

        return user;
    }
}
