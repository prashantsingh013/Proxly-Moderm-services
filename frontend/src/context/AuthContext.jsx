import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skillbridge_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error('Failed to authenticate token:', err);
        localStorage.removeItem('skillbridge_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('skillbridge_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      localStorage.setItem('skillbridge_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('skillbridge_token');
    setToken(null);
    setUser(null);
  };

  // 1-Click Demo Accounts for testing
  const switchDemoRole = async (role) => {
    setIsLoading(true);
    let email = 'customer1@skillbridge.in';
    let password = 'password123';

    if (role === 'provider') {
      email = 'provider1@skillbridge.in';
      password = 'password123';
    } else if (role === 'admin') {
      email = 'admin@skillbridge.in';
      password = 'admin123';
    }

    try {
      await login(email, password);
    } catch (err) {
      console.error('Failed to switch demo account:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        role: user?.role || 'guest',
        login,
        register,
        logout,
        switchDemoRole,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
