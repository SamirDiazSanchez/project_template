import React from 'react';
import { LogOut, Home, Users } from 'lucide-react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import instance from '../../infrastructure/services/api.service.ts';
import { useAuth } from '../../infrastructure/contexts/AuthContext';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, logout: authLogout } = useAuth();

  const logout = async () => {
    try {
      await instance.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      authLogout();
      navigate('/');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-vh-100 bg-dark-gradient text-white pb-5">
      {/* Navbar Shared */}
      <nav className="navbar navbar-expand border-bottom border-white border-opacity-10 sticky-top backdrop-blur-md bg-dark bg-opacity-75 h-auto py-2">
        <div className="container-fluid px-4">
          <div className="navbar-brand d-flex align-items-center gap-2 m-0 p-0 text-white">
            <span className="fw-bold fs-4 tracking-tight p-0">{import.meta.env.VITE_APP_NAME}</span>
          </div>

          <div className="collapse navbar-collapse ms-4">
            <ul className="navbar-nav gap-2">
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className={`nav-link d-flex align-items-center gap-2 px-3 rounded-2 transition-all ${isActive('/dashboard') ? 'text-white fw-bold bg-white bg-opacity-10' : 'text-secondary hover-light'}`} >
                  <Home size={18} />
                  Dashboard
                </Link>
              </li>
              {role === 'admin' && (
                <li className="nav-item">
                  <Link
                    to="/users"
                    className={`nav-link d-flex align-items-center gap-2 px-3 rounded-2 transition-all ${isActive('/users') ? 'text-white fw-bold bg-white bg-opacity-10' : 'text-secondary hover-light'}`} >
                    <Users size={18} />
                    Users
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <button onClick={logout} className="btn btn-link text-secondary text-decoration-none d-flex align-items-center gap-2 ms-auto hover-light">
            <LogOut size={20} />
            <span className="d-none d-sm-inline">Sign out</span>
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main className="container px-4 px-md-5 mt-5">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
