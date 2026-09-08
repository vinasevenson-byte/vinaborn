import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('cwb360_token');
    const savedUser = localStorage.getItem('cwb360_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('cwb360_token');
        localStorage.removeItem('cwb360_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao realizar login');
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('cwb360_token', data.token);
      localStorage.setItem('cwb360_user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      // Fallback local caso o backend não esteja em execução na mesma porta
      if (email === 'admin@curitiba360.com.br' && password === 'admin123') {
        const mockAdmin = { id: 1, name: 'Administrador Curitiba 360', email, role: 'ADMIN' };
        setUser(mockAdmin);
        setToken('mock-admin-token');
        localStorage.setItem('cwb360_token', 'mock-admin-token');
        localStorage.setItem('cwb360_user', JSON.stringify(mockAdmin));
        return { user: mockAdmin, token: 'mock-admin-token' };
      }
      if (email === 'parceiro@curitiba360.com.br' && password === 'parceiro123') {
        const mockPartner = { id: 2, name: 'Parceiro Ópera de Arame', email, role: 'PARTNER' };
        setUser(mockPartner);
        setToken('mock-partner-token');
        localStorage.setItem('cwb360_token', 'mock-partner-token');
        localStorage.setItem('cwb360_user', JSON.stringify(mockPartner));
        return { user: mockPartner, token: 'mock-partner-token' };
      }
      if (email === 'turista@curitiba360.com.br' && password === 'turista123') {
        const mockTourist = { id: 3, name: 'Vinicius Turista', email, role: 'TOURIST' };
        setUser(mockTourist);
        setToken('mock-tourist-token');
        localStorage.setItem('cwb360_token', 'mock-tourist-token');
        localStorage.setItem('cwb360_user', JSON.stringify(mockTourist));
        return { user: mockTourist, token: 'mock-tourist-token' };
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cwb360_token');
    localStorage.removeItem('cwb360_user');
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) return roles.includes(user.role);
    return user.role === roles;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
