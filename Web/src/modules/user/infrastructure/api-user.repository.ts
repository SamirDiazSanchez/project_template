import axiosInstance from "../../../shared/infrastructure/services/api.service.ts";
import { User } from "../domain/entities/user.entity.ts";
import type { PaginatedUsers } from "../domain/entities/user.entity.ts";
import type { UserRepository } from "../domain/repositories/user.repository.ts";

export class ApiUserRepository implements UserRepository {
  async list(page: number, size: number): Promise<PaginatedUsers> {
    const { data } = await axiosInstance.get(`/user?page=${page}&size=${size}`);

    return {
      users: data.data.map((u: any) => new User(u.id, u.name, u.email, u.role, u.isActive)),
      totalRecords: data.totalRecords
    };
  }

  async save(userId: string | null, name: string, email: string, role: string): Promise<void> {
    await axiosInstance.post('/user', { userId, name, email, role });
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/user/${id}`);
  }
}
