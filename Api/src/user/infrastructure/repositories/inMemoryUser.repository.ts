import type { User } from "@/user/domain/entities/user.entity.js";
import type { IUserRepository } from "@/user/domain/repository-interface/user.repository.interface.js";

export class InMemoryUserRepository implements IUserRepository {
    private users: User[] = [];

    async save(user: User): Promise<void> {
        this.users.push(user);
    }

    async findById(id: string): Promise<User | null> {
        return this.users.find(user => user.userId.value === id) || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.email.value === email) || null;
    }

    async listAll(): Promise<User[]> {
        return this.users;
    }

    async remove(id: string): Promise<void> {
        this.users = this.users.filter(user => user.userId.value !== id);
    }
}