import type { PaginatedUsers } from "../entities/user.entity.ts";

export interface UserRepository {
  list(page: number, size: number): Promise<PaginatedUsers>;
  save(userId: string | null, name: string, email: string, role: string): Promise<void>;
  delete(id: string): Promise<void>;
}
