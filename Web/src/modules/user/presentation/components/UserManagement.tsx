import { UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { useUsers } from '../../../../hooks/useUsers';
import type { User } from '../../domain/entities/user.entity';
import { UserForm } from './UserForm';
import { UserTable } from './UserTable';

export const UserManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { users, totalRecords, loading, saveUser, deleteUser } = useUsers(page, pageSize);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedUser(null);
  }

  return (
    <div className="py-2">
      <div className="row align-items-center justify-content-between g-4 mb-5">
        {/* Stats Mini */}
        <div className="col-12 col-md-2">
          <div className="glass-card p-3 border border-white border-opacity-5">
            <p className="text-secondary small fw-bold text-uppercase tracking-wider mb-1">Total Users</p>
            <p className="h3 fw-bold mb-0 text-primary">{totalRecords}</p>
          </div>
        </div>

        <div className="col-12 col-md-auto">
          <button
            className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 fw-bold"
            onClick={() => setShowForm(true)} >
            <UserPlus size={20} />
            Add New User
          </button>
        </div>
      </div>

      <UserTable
        users={users}
        onDelete={deleteUser}
        onEdit={handleEditUser}
        loading={loading}
        totalRecords={totalRecords}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage} />

      {showForm && (
        <UserForm
          data={selectedUser}
          onClose={handleClose}
          onSave={saveUser} />
      )}
    </div>
  );
};
