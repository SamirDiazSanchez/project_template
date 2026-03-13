import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Forbidden: React.FC = () => {
  return (
    <div className="min-vh-100 bg-dark-gradient text-white d-flex align-items-center justify-content-center">
      <div className="text-center bg-dark bg-opacity-25 backdrop-blur-md p-5 rounded-5 border border-white border-opacity-10 shadow-lg" style={{ maxWidth: '500px' }}>
        <div className="mb-4 d-inline-flex p-4 rounded-circle bg-danger bg-opacity-10 text-danger">
          <ShieldAlert size={64} />
        </div>
        <h1 className="display-4 fw-bold mb-0">403</h1>
        <h2 className="h3 fw-bold mb-4">Access Forbidden</h2>
        <p className="text-secondary mb-5">
          You don't have permission to access this resource. Please contact your administrator if you think this is a mistake.
        </p>
        <Link to="/dashboard" className="btn btn-outline-danger px-5 py-3 fw-bold rounded-pill shadow-sm">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
