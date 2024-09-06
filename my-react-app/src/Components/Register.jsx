import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css'; 

const Register = () => {
  const [csrfToken, setCsrfToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://chatify-api.up.railway.app/csrf', { method: 'PATCH' })
      .then(res => res.json())
      .then(data => {
        setCsrfToken(data.csrfToken);
      })
      .catch(err => console.error('Failed to fetch CSRF token', err));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://chatify-api.up.railway.app/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password,
          avatar: avatarUrl,
          csrfToken,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        setSuccessMessage('User successfully created!');
        setErrorMessage('');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage('Registration failed');
    }
  };

  const getRandomAvatar = () => {
    const randomId = Math.floor(Math.random() * 70) + 1;
    return `https://i.pravatar.cc/200?img=${randomId}`;
  };

  const handleAvatar = () => {
    setAvatarUrl(getRandomAvatar());
  };

  return (
    <div className={styles.loginBox}>
      <form onSubmit={handleRegister}>
        <div className={styles.userBox}>
          <input
            type="text"
            name="email"
            ref={emailRef}
            value={email}
            onChange={() => setEmail(emailRef.current.value)}
            required
          />
          <label>Email</label>
        </div>
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
        <div className={styles.btnBox}>
          <button type="submit" className={styles.btn}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Register
          </button>
          <button onClick={() => navigate('/login')} type="button" className={styles.btn}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Already have an account?
          </button>
        </div>
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <div className={styles.avat}>
          <h2>Choose an Avatar</h2>
          {avatarUrl && <img src={avatarUrl} alt="avatar" />}
          <button type="button" className={styles.rBtn} onClick={handleAvatar}>
            Choose a picture
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
