import { useState, useEffect, useCallback, useMemo } from 'react';
import { ApiUserRepository } from '../../infrastructure/api-user.repository.ts';
import { ListUsersUseCase } from '../../application/list-users.use-case.ts';
import { SaveUserUseCase } from '../../application/save-user.use-case.ts';
import { DeleteUserUseCase } from '../../application/delete-user.use-case.ts';
import { User } from '../../domain/entities/user.entity.ts';

export const useUsers = (page: number, size: number, enabled: boolean = true) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new ApiUserRepository(), []);

  const listUsersUseCase = useMemo(() => new ListUsersUseCase(repository), [repository]);
  const saveUserUseCase = useMemo(() => new SaveUserUseCase(repository), [repository]);
  const deleteUserUseCase = useMemo(() => new DeleteUserUseCase(repository), [repository]);

  const fetchUsers = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const response = await listUsersUseCase.execute(page, size);
      setUsers(response.users);
      setTotalRecords(response.totalRecords);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  }, [page, size, listUsersUseCase, enabled]);

  const saveUser = async (userId: string, name: string, email: string, role: string) => {
    await saveUserUseCase.execute(userId, name, email, role);
    await fetchUsers();
  };

  const deleteUser = async (id: string) => {
    await deleteUserUseCase.execute(id);
    await fetchUsers();
  };

  useEffect(() => {
    if (enabled) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [fetchUsers, enabled]);

  return { users, totalRecords, loading, error, saveUser, deleteUser, refetch: fetchUsers };
};
