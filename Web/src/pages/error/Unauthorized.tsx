import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-vh-100 bg-dark-gradient text-white d-flex align-items-center justify-content-center">
      <div className="text-center bg-dark bg-opacity-25 backdrop-blur-md p-5 rounded-5 border border-white border-opacity-10 shadow-lg" style={{ maxWidth: '500px' }}>
        <div className="mb-4 d-inline-flex p-4 rounded-circle bg-warning bg-opacity-10 text-warning">
          <Lock size={64} />
        </div>
        <h1 className="display-4 fw-bold mb-0">401</h1>
        <h2 className="h3 fw-bold mb-4">Unauthorized</h2>
        <p className="text-secondary mb-5">
          Your session has expired or you are not authorized to view this page. Please sign in again.
        </p>
        <Link to="/" className="btn btn-warning px-5 py-3 fw-bold rounded-pill shadow-sm">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
