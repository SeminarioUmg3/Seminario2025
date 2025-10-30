import { createContext, useState, useContext } from 'react';
import { fetchApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const data = await fetchApi('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    setUser(data.user);
    // Guarda el token si existe
    if (data.user?.token) {
      localStorage.setItem("token", data.user.token);
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);