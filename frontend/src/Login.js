import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUser, setSignupUser] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/login', {
        username: loginUser,
        password: loginPassword
      }, { withCredentials: true });
      

      if (res.data.success) {
        localStorage.setItem('userId', res.data.userId);
        alert('Login successful!');
        window.location.href = '/upload'; // ✅ Send to upload page
      } else {
        alert('Login failed. Check credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post('/api/signup', {
        username: signupUser,
        password: signupPassword,
      });
  
      if (res.data.success) {
        alert('Signup successful! You can now log in.');
        setSignupUser('');
        setSignupPassword('');
      } else {
        alert(res.data.message); 
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📷 Welcome to Photo Gallery</h2>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>🔐 Login</h3>
        <input
          type="text"
          placeholder="User ID"
          value={loginUser}
          onChange={(e) => setLoginUser(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleLogin} style={loginButtonStyle}>Login</button>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h3>📝 Sign Up</h3>
        <input
          type="text"
          placeholder="New User ID"
          value={signupUser}
          onChange={(e) => setSignupUser(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="New Password"
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleSignup} style={signupButtonStyle}>Sign Up</button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const loginButtonStyle = {
  backgroundColor: '#4f46e5',
  color: '#fff',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100%',
  fontSize: '16px',
};

const signupButtonStyle = {
  backgroundColor: '#10b981',
  color: '#fff',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100%',
  fontSize: '16px',
};

export default Login;
