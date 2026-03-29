import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('ciq_token'));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/user/me')
        .then(r => setUser(r.data.data.user))
        .catch(() => {
          localStorage.removeItem('ciq_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { token: t, user: u } = data.data;
    localStorage.setItem('ciq_token', t);
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    setToken(t);
    setUser(u);
    return u;
  };

  const register = async (name, email, password, phone) => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        phone: phone || '',
      });

      const { token: t, user: u } = data.data;
      localStorage.setItem('ciq_token', t);
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      setToken(t);
      setUser(u);
      return { success: true, user: u };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('ciq_token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
