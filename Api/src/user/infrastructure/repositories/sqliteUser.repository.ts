import Database from "better-sqlite3";
import { User } from "@/user/domain/entities/user.entity.js";
import { UserId } from "@/user/domain/value-object/userId.vo.js";
import { UserEmail } from "@/user/domain/value-object/userEmail.vo.js";
import type { IUserRepository } from "@/user/domain/repository-interface/user.repository.interface.js";
import { UserRole } from "@/user/domain/value-object/userRole.vo.js";

export class SqliteUserRepository implements IUserRepository {
    private db: Database.Database;

    constructor(dbPath: string = "database.db") {
        this.db = new Database(dbPath);
        this.init();
    }

    private init(): void {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                userId TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                userName TEXT NOT NULL,
                role TEXT NOT NULL,
                isActive INTEGER DEFAULT 1,
                createdBy TEXT,
                createdAt TEXT,
                updatedBy TEXT,
                updatedAt TEXT
            )
        `;
        this.db.exec(createTableQuery);
    }

    async save(user: User): Promise<void> {
        try {
            const stmt = this.db.prepare(`
            INSERT INTO users (userId, email, userName, role, isActive, createdBy, createdAt, updatedBy, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(userId) DO UPDATE SET
                email = excluded.email,
                userName = excluded.userName,
                role = excluded.role,
                isActive = excluded.isActive,
                createdBy = excluded.createdBy,
                createdAt = excluded.createdAt,
                updatedBy = excluded.updatedBy,
                updatedAt = excluded.updatedAt
        `);

            stmt.run(
                user.userId.value,
                user.email.value,
                user.userName,
                user.role.value,
                user.isActive ? 1 : 0,
                user.recorderId?.value || null,
                new Date().toISOString(),
                user.recorderId?.value || null,
                new Date().toISOString()
            );
        } catch (error) {
            throw error;
        }
    }

    async findById(id: string): Promise<User | null> {
        const stmt = this.db.prepare(`SELECT * FROM users WHERE userId = ?`);
        const row = stmt.get(id) as any;

        if (!row) return null;

        return this.mapToUser(row);
    }

    async findByEmail(email: string): Promise<User | null> {
        const stmt = this.db.prepare(`SELECT * FROM users WHERE email = ?`);
        const row = stmt.get(email) as any;

        if (!row) return null;

        return this.mapToUser(row);
    }

    async listAll(pageNumber: number, pageSize: number): Promise<{ users: User[], totalRecords: number }> {
        const stmt = this.db.prepare(`SELECT * FROM users LIMIT ? OFFSET ?`);
        const offset = (pageNumber - 1) * pageSize;
        const rows = stmt.all(pageSize, offset) as any[];

        const totalStmt = this.db.prepare(`SELECT COUNT(*) as total FROM users`);
        const total = (totalStmt.get() as any).total;

        return {
            users: rows.map(row => this.mapToUser(row)),
            totalRecords: total
        };
    }

    async remove(id: string, recorderId: string): Promise<void> {
        const stmt = this.db.prepare(`UPDATE users SET isActive = 0, updatedBy = ? WHERE userId = ?`);
        stmt.run(recorderId, id);
    }

    private mapToUser(row: any): User {
        const user = new User(
            new UserId(row.userId),
            new UserEmail(row.email),
            row.userName,
            new UserRole(row.role)
        );

        if (row.recorderId) user.setRecordId(new UserId(row.recorderId));

        return user;
    }
}
