import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-vh-100 bg-dark-gradient text-white d-flex align-items-center justify-content-center">
      <div className="text-center bg-dark bg-opacity-25 backdrop-blur-md p-5 rounded-5 border border-white border-opacity-10 shadow-lg" style={{ maxWidth: '500px' }}>
        <div className="mb-4 d-inline-flex p-4 rounded-circle bg-primary bg-opacity-10 text-primary">
          <FileQuestion size={64} />
        </div>
        <h1 className="display-1 fw-bold mb-0">404</h1>
        <h2 className="h3 fw-bold mb-4">Page Not Found</h2>
        <p className="text-secondary mb-5">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary px-5 py-3 fw-bold rounded-pill shadow-sm">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
