import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

  const login = (newRole, newUserId) => {
    localStorage.setItem('role', newRole);
    setUserId(newUserId);
    localStorage.setItem('userId', newUserId);
  };

  const logout = () => {
    localStorage.clear();
    setUserId('');
  };

  // Accédez directement à `role` depuis localStorage
  const role = localStorage.getItem('role');

  return (
    <AuthContext.Provider value={{ role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export { AuthContext };
