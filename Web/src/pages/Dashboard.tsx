import { Users } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../modules/user/presentation/hooks/useUsers';
import { useAuth } from '../shared/infrastructure/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  
  // We only fetch users if the user is an admin to avoid 403 errors from the backend
  const { totalRecords } = useUsers(1, 1, isAdmin);

  return (
    <>
      <div className="row align-items-center justify-content-between g-4 mb-5">
        <div className="col-12 col-md-auto text-center text-md-start">
          <h1 className="display-4 fw-bold tracking-tight mb-2">Welcome Dashboard</h1>
          <p className="text-secondary mb-0">System overview and quick statistics.</p>
        </div>
      </div>

      {/* Home Stats Grid */}
      <div className="row g-4 mb-5">
        {isAdmin && (
          <div className="col-12 col-md-4">
            <div className="glass-card p-4 d-flex align-items-center gap-4 h-100 border border-white border-opacity-5">
              <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary">
                <Users size={32} />
              </div>
              <div>
                <p className="text-secondary small fw-bold text-uppercase tracking-wider mb-1">Users</p>
                <p className="h2 fw-bold mb-0">{totalRecords}</p>
                <Link to="/users" className="small text-primary text-decoration-none hover:underline">Manage users →</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
