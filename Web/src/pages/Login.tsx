import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../shared/infrastructure/services/api.service';
import { Lock, Loader2, Sun, Moon, Languages } from 'lucide-react';
import { useAuth } from '../shared/infrastructure/contexts/AuthContext';
import { useTheme } from '../shared/infrastructure/contexts/ThemeContext';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response: any) => {
    setLoading(true);
    setError('');
    try {
      const { credential } = response;
      const res = await api.post('/auth/google', { idToken: credential });
      login(res.data.role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError(t('login.error'));
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-4 bg-dark-gradient position-relative">
      {/* Top Controls */}
      <div className="position-absolute top-0 end-0 p-4 d-flex gap-2">
        <button
          onClick={toggleLanguage}
          className="theme-toggle"
          title={i18n.language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
        >
          <Languages size={24} />
          <span className="ms-1 fw-bold small text-uppercase">{i18n.language === 'en' ? 'ES' : 'EN'}</span>
        </button>

        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="glass-card w-100 p-4 p-md-5" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center border border-primary border-opacity-25 bg-primary bg-opacity-10 rounded-4 mb-3" style={{ width: '64px', height: '64px' }}>
            <Lock className="text-primary" size={32} />
          </div>
          <h1 className="display-6 fw-bold gradient-text mb-2">
            {t('login.welcome', { appName: import.meta.env.VITE_APP_NAME })}
          </h1>
          <p className="text-secondary">{t('login.signIn')}</p>
        </div>

        <div className="d-flex justify-content-center py-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme={theme === 'dark' ? 'filled_black' : 'outline'}
            text="signin_with"
            shape="pill"
            width="100%"
          />
        </div>

        {loading && (
          <div className="text-center mt-3">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2 px-3 mt-4 rounded-3 border-0 bg-danger bg-opacity-10 text-danger small text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
