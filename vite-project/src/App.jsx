import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminPage from './components/AdminPage';
import UserPage from './components/UserPage';
import './styles.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [roles, setRoles] = useState(JSON.parse(localStorage.getItem("userRoles") || "[]"));

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    const storedRoles = JSON.parse(localStorage.getItem("userRoles") || "[]");

    setToken(storedToken);
    setRoles(storedRoles);
  }, []);

  const isAuthenticated = !!token;

  return (
    <Routes>
      <Route path="/login" element={<Login onAuthChange={() => window.location.reload()} />} />
      <Route path="/signup" element={<Signup onAuthChange={() => window.location.reload()} />} />

      <Route
        path="/admin"
        element={isAuthenticated && roles.includes("ADMIN")
          ? <AdminPage />
          : <Navigate to="/login" />}
      />

      <Route
        path="/user"
        element={isAuthenticated
          ? <UserPage />
          : <Navigate to="/login" />}
      />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
