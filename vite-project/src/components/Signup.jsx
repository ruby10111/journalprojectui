import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { jwtDecode } from "jwt-decode";

const Signup = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sentimentAnalysis, setSentimentAnalysis] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await api.post('/public/signup', { userName, email, password, sentimentAnalysis });

      const loginResponse = await api.post('/public/login', { userName, password });
      const token = loginResponse.data;
      localStorage.setItem("jwtToken", token);

      const decoded = jwtDecode(token);
      let roles = decoded.roles || [];
      roles = roles.map(r => r.replace("ROLE_", ""));
      localStorage.setItem("userRoles", JSON.stringify(roles));

      if (roles.includes("ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/user");
      }

      window.location.reload(); // 👈 FIX redirect issue

    } catch (err) {
      console.error(err);
      setError("Signup failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>

      <form onSubmit={handleSignup}>
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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="sentimentAnalysis"
            checked={sentimentAnalysis}
            onChange={(e) => setSentimentAnalysis(e.target.checked)}
          />
          <label htmlFor="sentimentAnalysis">Enable Sentiment Analysis</label>
        </div>

        <button type="submit">Sign Up</button>
        {error && <p className="error">{error}</p>}
      </form>

      <p className="link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
