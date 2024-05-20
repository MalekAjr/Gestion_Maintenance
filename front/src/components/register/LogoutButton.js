import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authorization/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signup');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default LogoutButton;
