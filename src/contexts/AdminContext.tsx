import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { hasAdminSession, setAdminSession, clearAdminSession } from '../utils/auth.utils';

interface AdminContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(hasAdminSession());
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    setAdminSession(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    clearAdminSession();
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
