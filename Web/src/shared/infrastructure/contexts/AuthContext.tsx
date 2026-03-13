import React, { createContext, useContext, useState, useMemo } from 'react';
import { CookieSessionRepository } from '../repositories/cookie-session.repository';

interface AuthContextType {
  role: string | null;
  isAuthenticated: boolean;
  login: (role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sessionRepository = useMemo(() => new CookieSessionRepository(), []);
  const [role, setRole] = useState<string | null>(sessionRepository.get('user_role'));

  const login = (newRole: string) => {
    setRole(newRole);
    sessionRepository.set('user_role', newRole);
  };

  const logout = () => {
    setRole(null);
    sessionRepository.clear();
  };

  const isAuthenticated = !!role;

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
