import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.service';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../shared/infrastructure/contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { cryptoService } from '../shared/infrastructure/services/aes-crypto.service';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email });
      const decryptedRole = cryptoService.decrypt(response.data.role);
      login(decryptedRole);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    setLoading(true);
    setError('');
    try {
      const { credential } = response;
      const res = await api.post('/auth/google', { idToken: credential });
      const decryptedRole = cryptoService.decrypt(res.data.role);
      login(decryptedRole);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed');
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-4 bg-dark-gradient">
      <div className="glass-card w-100 p-4 p-md-5" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center border border-primary border-opacity-25 bg-primary bg-opacity-10 rounded-4 mb-3" style={{ width: '64px', height: '64px' }}>
            <Lock className="text-primary" size={32} />
          </div>
          <h1 className="display-6 fw-bold gradient-text mb-2">Welcome to {import.meta.env.VITE_APP_NAME}</h1>
          <p className="text-secondary">Sign in please</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4 text-start">
            <label className="form-label text-secondary small fw-bold mb-2">EMAIL ADDRESS</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-secondary">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                className="form-control bg-transparent border-secondary border-opacity-25 text-white py-2 shadow-none"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-4" >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className="d-flex align-items-center gap-3 mb-4">
          <hr className="flex-grow-1 border-secondary border-opacity-25" />
          <span className="text-secondary small fw-bold">OR</span>
          <hr className="flex-grow-1 border-secondary border-opacity-25" />
        </div>

        <div className="d-flex justify-content-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_black"
            text="signin_with"
            shape="pill"
            width="100%"
          />
        </div>

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
