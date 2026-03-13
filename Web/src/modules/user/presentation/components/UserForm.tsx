import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { User } from '../../domain/entities/user.entity';

interface UserFormProps {
  onClose: () => void;
  onSave: (userId: string, name: string, email: string, role: string) => Promise<void>;
  data?: User | null;
}

export const UserForm: React.FC<UserFormProps> = ({ onClose, onSave, data }) => {
  const [userId, _] = useState(data?.userId || '');
  const [name, setName] = useState(data?.name || '');
  const [email, setEmail] = useState(data?.email || '');
  const [role, setRole] = useState(data?.role || 'user');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(userId, name, email, role);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block backdrop-blur-md bg-dark bg-opacity-50" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content glass-card border-white border-opacity-10 bg-dark text-white p-2">
          <div className="modal-header border-bottom border-white border-opacity-5">
            <h5 className="modal-title fw-bold">Save User</h5>
            <button type="button" className="btn-close btn-close-white shadow-none" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body py-4">
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">USER NAME</label>
                <input
                  type="text"
                  className="form-control bg-transparent border-white border-opacity-10 text-white shadow-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">EMAIL ADDRESS</label>
                <input
                  type="email"
                  className="form-control bg-transparent border-white border-opacity-10 text-white shadow-none"
                  value={email}
                  disabled={!!data}
                  onChange={(e) => setEmail(e.target.value)}
                  required />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">ROLE</label>
                <select
                  className="form-select bg-dark border-white border-opacity-10 text-white shadow-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)} >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer border-top border-white border-opacity-5">
              <button type="button" className="btn btn-link text-secondary text-decoration-none" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary px-4 fw-bold" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
