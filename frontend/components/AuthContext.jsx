'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load from localStorage on mount and check expiration
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    const loginTime = localStorage.getItem('login_time');
    const THIRTY_MINUTES = 30 * 60 * 1000;
    
    if (storedToken && storedUser) {
      if (loginTime && Date.now() - parseInt(loginTime, 10) > THIRTY_MINUTES) {
        // Session expired before page load
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('login_time');
        localStorage.setItem('session_expired', 'true');
      } else {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  // Periodic session checking for hard 30-minute limit
  useEffect(() => {
    if (!user) return;
    
    const THIRTY_MINUTES = 30 * 60 * 1000;

    const checkSession = () => {
      const storedToken = localStorage.getItem('auth_token');
      const loginTime = localStorage.getItem('login_time');
      if (storedToken && loginTime) {
        if (Date.now() - parseInt(loginTime, 10) > THIRTY_MINUTES) {
          const isAdminPage = window.location.pathname.startsWith('/admin');
          logout('expired', !isAdminPage);
        }
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('login_time', Date.now().toString());
    localStorage.setItem('just_logged_in', 'true');
    router.push('/admin');
  };

  const logout = (reason = 'success', silent = false) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('login_time');
    if (reason === 'expired') {
      localStorage.setItem('session_expired', 'true');
    }
    if (!silent) {
      router.push(`/admin/login?logout=${reason !== 'expired' ? reason : ''}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
