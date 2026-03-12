import type { User } from "../entities/user.entity.js";

export interface IUserRepository {
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    listAll(pageNumber: number, pageSize: number): Promise<User[]>;
    remove(id: string, recorderId: string): Promise<void>;
}