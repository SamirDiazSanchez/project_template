import React from 'react';
import { LogOut, Home, Users, Shield, Sun, Moon, Languages } from 'lucide-react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import instance from '../../infrastructure/services/api.service.ts';
import { useAuth } from '../../infrastructure/contexts/AuthContext';
import { useTheme } from '../../infrastructure/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, logout: authLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

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

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="min-vh-100 bg-dark-gradient pb-5">
      {/* Navbar Shared */}
      <nav className="navbar navbar-expand border-bottom border-white border-opacity-10 sticky-top backdrop-blur-md h-auto py-2" style={{ backgroundColor: 'var(--nav-bg)' }}>
        <div className="container-fluid px-4">
          <div className="navbar-brand d-flex align-items-center gap-2 m-0 p-0 text-main" style={{ color: 'var(--text-main)' }}>
            <span className="fw-bold fs-4 tracking-tight p-0">{import.meta.env.VITE_APP_NAME}</span>
          </div>

          <div className="collapse navbar-collapse ms-4">
            <ul className="navbar-nav gap-2">
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className={`nav-link d-flex align-items-center gap-2 px-3 rounded-2 transition-all ${isActive('/dashboard') ? 'text-main fw-bold bg-white bg-opacity-10' : 'text-secondary hover-light'}`} style={{ color: isActive('/dashboard') ? 'var(--text-main)' : 'var(--text-muted)' }} >
                  <Home size={18} />
                  {t('navbar.dashboard')}
                </Link>
              </li>
              {role === 'admin' && (
                <>
                  <li className="nav-item">
                    <Link
                      to="/users"
                      className={`nav-link d-flex align-items-center gap-2 px-3 rounded-2 transition-all ${isActive('/users') ? 'text-main fw-bold bg-white bg-opacity-10' : 'text-secondary hover-light'}`} style={{ color: isActive('/users') ? 'var(--text-main)' : 'var(--text-muted)' }} >
                      <Users size={18} />
                      {t('navbar.users')}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/appCredentials"
                      className={`nav-link d-flex align-items-center gap-2 px-3 rounded-2 transition-all ${isActive('/appCredentials') ? 'text-main fw-bold bg-white bg-opacity-10' : 'text-secondary hover-light'}`} style={{ color: isActive('/appCredentials') ? 'var(--text-main)' : 'var(--text-muted)' }} >
                      <Shield size={18} />
                      {t('navbar.appCredentials')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="d-flex align-items-center gap-3 ms-auto">
            <button
              onClick={toggleLanguage}
              className="theme-toggle"
              title={i18n.language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
            >
              <Languages size={20} />
              <span className="ms-1 fw-bold small text-uppercase d-none d-sm-inline">{i18n.language === 'en' ? 'ES' : 'EN'}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={logout} className="btn btn-link text-secondary text-decoration-none d-flex align-items-center gap-2 hover-light" style={{ color: 'var(--text-muted)' }}>
              <LogOut size={20} />
              <span className="d-none d-sm-inline">{t('navbar.signOut')}</span>
            </button>
          </div>
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
