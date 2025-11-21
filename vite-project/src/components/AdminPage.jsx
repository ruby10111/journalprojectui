import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
     const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [sentimentAnalysis, setSentimentAnalysis] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create new admin user
  const handleCreateAdmin = async () => {
    try {
      await api.post(
        "/admin/create-admin-user",
        {
          userName,
          password,
          email,
          sentimentanalysis: sentimentAnalysis,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Admin user created!");
      setUserName("");
      setPassword("");
      setEmail("");
      setSentimentAnalysis(false);
      fetchUsers();
    } catch (error) {
      console.error("Error creating admin user:", error);
      setMessage("Failed to create admin user");
    }
  };

 const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="form-container">
      <Navbar />

      <h2>Admin Dashboard</h2>
      {message && <p>{message}</p>}

      <h3>Create Admin User</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={sentimentAnalysis}
            onChange={(e) => setSentimentAnalysis(e.target.checked)}
          />
          Enable Sentiment Analysis
        </label>
      </div>
      <button onClick={handleCreateAdmin}>Create Admin</button>

      <h3 style={{ marginTop: "30px" }}>All Users</h3>
      {users.length > 0 ? (
        <ul style={{ textAlign: "left" }}>
          {users.map((user) => (
            <li key={user.id}>
              {user.userName} - {user.email} - Sentiment:{" "}
              {user.sentimentanalysis ? "Enabled" : "Disabled"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
 <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>

    </div>
  );
};

export default AdminPage;
