import React from 'react';
import { User } from '../../domain/entities/user.entity.ts';
import { Trash2, Edit2 } from 'lucide-react';

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
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="border-0 overflow-hidden shadow-lg mt-4">
      <div className="table-responsive">
        <table className="table table-dark table-hover mb-0 align-middle">
          <thead className="bg-white bg-opacity-5 text-secondary small fw-bold text-uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 border-0">User</th>
              <th className="px-4 py-3 border-0">Email</th>
              <th className="px-4 py-3 border-0">Role</th>
              <th className="px-4 py-3 border-0">Status</th>
              <th className="px-4 py-3 border-0 text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="border-top-0 border-white border-opacity-5">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-5 text-secondary">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-5 text-secondary">No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.userId} className="border-bottom border-white border-opacity-5">
                  <td className="px-4 py-3 border-0">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-gradient-brand d-flex align-items-center justify-content-center fw-bold small text-white" style={{ width: '36px', height: '36px' }}>
                        {user.name.charAt(0)}
                      </div>
                      <span className="fw-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-0 text-secondary">{user.email}</td>
                  <td className="px-4 py-3 border-0">
                    <span className={`badge rounded-pill fw-bold text-uppercase tracking-wider py-1.5 px-3 border border-opacity-25 bg-warning bg-opacity-10 text-warning border-warning`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-0">
                    <span className={`badge rounded-pill fw-bold text-uppercase tracking-wider py-1.5 px-3 border border-opacity-25 ${user.isActive ? 'bg-success bg-opacity-10 text-success border-success' : 'bg-danger bg-opacity-10 text-danger border-danger'
                      }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-0 text-end">
                    <div className="d-flex align-items-center justify-content-end gap-1">
                      <button
                        onClick={() => onEdit(user)}
                        className="btn btn-link text-secondary p-2 hover-light">
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn btn-link text-secondary p-2 hover-danger"
                        onClick={() => onDelete(user.userId)} >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-white bg-opacity-5 border-top border-white border-opacity-5 d-flex align-items-center justify-content-between">
          <div className="text-secondary small">
            Showing <span className="text-white fw-bold">{(currentPage - 1) * pageSize + 1}</span> to <span className="text-white fw-bold">{Math.min(currentPage * pageSize, totalRecords)}</span> of <span className="text-white fw-bold">{totalRecords}</span> entries
          </div>
          <nav>
            <ul className="pagination pagination-sm mb-0 gap-1">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link bg-transparent border-white border-opacity-10 text-secondary rounded-2 px-3"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1} >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button
                    className={`page-link border-white border-opacity-10 rounded-2 px-3 ${currentPage === i + 1 ? 'bg-primary border-primary text-white' : 'bg-transparent text-secondary'
                      }`}
                    onClick={() => onPageChange(i + 1)} >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link bg-transparent border-white border-opacity-10 text-secondary rounded-2 px-3"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages} >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};
