import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authorization/AuthContext';
import { useTheme } from '../ThemeContext';
import moonImageDark from '../../imgs/night-mode.png';
import moonImage from '../../imgs/sleep-mode.png';

function Navbartotal() {
  const { role, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signup");
  };

  const toggleDarkMode = () => {
    toggleTheme();
  };

  const renderNavContent = () => {
    if (role === 'admin') {
      return (
        <>
          <Link to="/admin/dashboard" style={{ color: 'white', marginRight: '30px' }}>
            <button style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Back to Dashboard</button>
          </Link>
          <button onClick={handleLogout} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Logout</button>
        </>
      );
    } else if (role) {
      return (
        <>
          <button onClick={handleLogout} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Logout</button>
        </>
      );
    } else {
      return (
        <Link to="/signup" style={{ color: 'white', marginRight: '10px' }}>Login</Link>
      );
    }
  };

  return (
    <nav style={{ backgroundColor: '#ff5a5f', padding: '10px', display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
      <div>
        <Link to="/home" style={{ color: 'white', marginRight: '10px' }}>Home</Link>
        <Link to="/about" style={{ color: 'white', marginRight: '10px' }}>About</Link>
        <Link to="/contact" style={{ color: 'white', marginRight: '10px' }}>Contact</Link>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={`croissant-toggle ${darkMode ? 'dark' : 'light'}`} onClick={toggleDarkMode} style={{ marginRight: '10px' }}>
          {darkMode ? (
            <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ff5a5f', borderRadius: '50%' }}>
              <img
                src={moonImage}
                alt="Moon"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          ) : (
            <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ff5a5f', borderRadius: '50%' }}>
              <img
                src={moonImageDark}
                alt="Moon"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          )}
        </div>
        {renderNavContent()}
      </div>
    </nav>
  );
}

export default Navbartotal;
