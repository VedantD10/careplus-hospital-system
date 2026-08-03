import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_ADMIN = {
  id: 1,
  name: 'Dr. Rajesh Sharma (Admin)',
  email: 'admin@careplus.com',
  role: 'ADMIN',
  phone: '+91 98100 12345',
  avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('careplus_user');
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
    } catch (e) {
      return DEFAULT_ADMIN;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('careplus_token', res.token);
      localStorage.setItem('careplus_user', JSON.stringify(res.user));
      setUser(res.user);
      return res.user;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const register = async (patientData) => {
    const res = await api.post('/auth/register', patientData);
    localStorage.setItem('careplus_token', res.token);
    localStorage.setItem('careplus_user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('careplus_token');
    localStorage.removeItem('careplus_user');
    setUser(null);
  };

  const switchRolePreset = async (role) => {
    const presets = {
      ADMIN: { email: 'admin@careplus.com', password: 'password123' },
      DOCTOR: { email: 'vikram.malhotra@careplus.com', password: 'password123' },
      RECEPTIONIST: { email: 'reception@careplus.com', password: 'password123' },
      PATIENT: { email: 'patient@careplus.com', password: 'password123' }
    };
    const creds = presets[role];
    if (creds) {
      try {
        return await login(creds.email, creds.password);
      } catch (err) {
        // Fallback local user mock for role switching if API fails
        const mockUser = {
          role,
          name: role === 'ADMIN' ? 'Dr. Rajesh Sharma (Admin)' : role === 'DOCTOR' ? 'Dr. Vikram Malhotra' : role === 'RECEPTIONIST' ? 'Priya Deshmukh' : 'Aarav Verma',
          email: creds.email
        };
        setUser(mockUser);
        localStorage.setItem('careplus_user', JSON.stringify(mockUser));
        return mockUser;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchRolePreset }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
