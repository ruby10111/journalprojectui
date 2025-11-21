import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/public/login', { userName, password });

      const token = response.data;
      localStorage.setItem("jwtToken", token);

      const decoded = jwtDecode(token);
      let roles = decoded.roles || [];
      roles = roles.map(r => r.replace("ROLE_", ""));
      localStorage.setItem("userRoles", JSON.stringify(roles));

      console.log("Redirecting with roles:", roles);

      if (roles.includes("ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/user");
      }

      window.location.reload(); // 👈 FORCE UI update

    } catch (err) {
      setError('Incorrect Username or password');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>

      <p className="link">
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
