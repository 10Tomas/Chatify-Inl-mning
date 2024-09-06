import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; 

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://chatify-api.up.railway.app/csrf', { method: 'PATCH' })
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrfToken);
      })
      .catch((err) => console.error('Failed to fetch CSRF token:', err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://chatify-api.up.railway.app/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          csrfToken,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
      } else {
        localStorage.setItem('userToken', data.token);
        setSuccessMessage('User Login Successful, redirecting...');
        setErrorMessage('');

        setTimeout(() => {
          navigate('/chat');
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login.');
    }
  };

  return (
    <div className={styles.loginBox}>
      <form onSubmit={handleLogin}>
        <div className={styles.userBox}>
          <input
            type="text"
            name="username"
            ref={usernameRef}
            value={username}
            onChange={() => setUsername(usernameRef.current.value)}
            required
          />
          <label>Username</label>
        </div>
        <div className={styles.userBox}>
          <input
            type="password"
            name="password"
            ref={passwordRef}
            value={password}
            onChange={() => setPassword(passwordRef.current.value)}
            required
          />
          <label>Password</label>
        </div>
        <button type="submit" className={styles.btn}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Login
        </button>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
