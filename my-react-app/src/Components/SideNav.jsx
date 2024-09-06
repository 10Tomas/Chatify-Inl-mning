import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SideNav.module.css'; 

const SideNav = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const handleToggle = () => setIsVisible(prevState => !prevState);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <div>
      <button className={styles.toggleButton} onClick={handleToggle}>
        {isVisible ? 'Hide' : 'Show'} SideNav
      </button>

      {isVisible && (
        <nav className={styles.sidenavContainer}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </nav>
      )}
    </div>
  );
};

export default SideNav;
