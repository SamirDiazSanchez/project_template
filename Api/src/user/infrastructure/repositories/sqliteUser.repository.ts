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
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
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
            INSERT INTO users (id, email, name, role, isActive, createdBy, createdAt, updatedBy, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                email = excluded.email,
                name = excluded.name,
                role = excluded.role,
                isActive = excluded.isActive,
                createdBy = excluded.createdBy,
                createdAt = excluded.createdAt,
                updatedBy = excluded.updatedBy,
                updatedAt = excluded.updatedAt
        `);

            stmt.run(
                user.id.value,
                user.email.value,
                user.name,
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
        const stmt = this.db.prepare(`SELECT * FROM users WHERE id = ?`);
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

    async listAll(): Promise<User[]> {
        const stmt = this.db.prepare(`SELECT * FROM users`);
        const rows = stmt.all() as any[];

        return rows.map(row => this.mapToUser(row));
    }

    async remove(id: string): Promise<void> {
        const stmt = this.db.prepare(`UPDATE users SET isActive = 0 WHERE id = ?`);
        stmt.run(id);
    }

    private mapToUser(row: any): User {
        const user = new User(
            new UserId(row.id),
            new UserEmail(row.email),
            row.name,
            new UserRole(row.role)
        );

        if (row.recorder_id) user.setRecordId(new UserId(row.recorder_id));

        return user;
    }
}
