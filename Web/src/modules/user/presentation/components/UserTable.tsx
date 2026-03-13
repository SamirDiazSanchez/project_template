import React, { useMemo } from 'react';
import { User } from '../../domain/entities/user.entity.ts';
import { Trash2, Edit2 } from 'lucide-react';
import { GenericTable } from '../../../../shared/presentation/components/GenericTable';
import type { Column, Action } from '../../../../shared/presentation/components/GenericTable';

interface UserTableProps {
  users: User[];
  onDelete: (id: string) => void;
  onEdit: (user: User) => void;
  loading: boolean;
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onDelete,
  onEdit,
  loading,
  totalRecords,
  currentPage,
  pageSize,
  onPageChange
}) => {
  const columns: Column<User>[] = useMemo(() => [
    {
      header: 'User',
      key: 'name',
      render: (user) => (
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle bg-gradient-brand d-flex align-items-center justify-content-center fw-bold small text-white" style={{ width: '36px', height: '36px' }}>
            {user.name.charAt(0)}
          </div>
          <span className="fw-medium">{user.name}</span>
        </div>
      )
    },
    {
      header: 'Email',
      key: 'email'
    },
    {
      header: 'Role',
      key: 'role',
      render: (user) => (
        <span className="badge rounded-pill fw-bold text-uppercase tracking-wider py-1.5 px-3 border border-opacity-25 bg-warning bg-opacity-10 text-warning border-warning">
          {user.role}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'isActive',
      render: (user) => (
        <span className={`badge rounded-pill fw-bold text-uppercase tracking-wider py-1.5 px-3 border border-opacity-25 ${user.isActive ? 'bg-success bg-opacity-10 text-success border-success' : 'bg-danger bg-opacity-10 text-danger border-danger'}`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ], []);

  const actions: Action<User>[] = useMemo(() => [
    {
      icon: <Edit2 size={16} />,
      label: 'Edit',
      onClick: (user) => onEdit(user)
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Delete',
      variant: 'danger',
      onClick: (user) => onDelete(user.userId)
    }
  ], [onEdit, onDelete]);

  return (
    <GenericTable
      data={users}
      columns={columns}
      actions={actions}
      loading={loading}
      totalRecords={totalRecords}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={onPageChange}
      rowKey={(user) => user.userId}
      loadingMessage="Loading users..."
      noDataMessage="No users found."
    />
  );
};

