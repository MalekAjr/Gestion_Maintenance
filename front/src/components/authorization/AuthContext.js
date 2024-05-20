// In AuthContext.js

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

  const login = (newRole, newUserId) => {
    setRole(newRole);
    setUserId(newUserId);
    localStorage.setItem('role', newRole);
    localStorage.setItem('userId', newUserId);
  };

  const logout = () => {
    setRole('');
    setUserId(''); // Reset userId when logging out
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export { AuthContext };
