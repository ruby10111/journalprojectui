import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const [message, setMessage] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [journalsWithId, setJournalsWithId] = useState([]);


  const [journals, setJournals] = useState([]);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchWeatherGreeting = async () => {
    try {
      const response = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

const fetchJournals1 = async () => {
  try {
    const response = await api.get("/journal/getid", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      setJournalsWithId(response.data);
      console.log("Journals with _id:", response.data);
    }
  } catch (error) {
    console.error("Error fetching journals with _id:", error);
  }
};


  const fetchJournals = async () => {
    try {
      const response = await api.get("/journal", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setJournals(response.data);
        console.log("Journal data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching journals:", error);
    }
  };

  useEffect(() => {
    fetchWeatherGreeting();
    fetchJournals();
     fetchJournals1();
  }, []);

  const handleUpdate = async () => {
    try {
      await api.put(
        "/user",
        { userName: newUserName, password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated successfully!");
      setNewPassword("");
      setNewUserName("");
      fetchWeatherGreeting();
    } catch (error) {
      setMessage("Failed to update user");
      console.error(error);
    }
  };

  const handleDeleteUser = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    try {
      await api.delete("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      navigate("/login");
    } catch (error) {
      setMessage("Error deleting account");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

 const handleJournalSubmit = async () => {
   try {
     if (editingId) {
     await api.put(
       `/journal/id/${editingId}`,
       { title: journalTitle, content: journalContent, sentiment: null },
       { headers: { Authorization: `Bearer ${token}` } }
     );

       setMessage("Journal updated!");
     } else {
       await api.post(
         "/journal",
         { title: journalTitle, content: journalContent, sentiment: null },
         { headers: { Authorization: `Bearer ${token}` } }
       );
       setMessage("Journal created!");
     }

     await fetchJournals();  // Wait for refresh before clearing ID

     setJournalTitle("");
     setJournalContent("");
     setEditingId(null);  // <-- Only clear after update completes
   } catch (error) {
     console.error("Error saving journal:", error);
     setMessage("Failed to save journal");
   }
 };

const handleEdit = (journal) => {
  // Find the _id from journalsWithId based on some unique property (e.g., title + date)
  const match = journalsWithId.find(j => j.title === journal.title && j.date === journal.date);
  if (!match) return;

  setEditingId(match._id); // use _id from backend
  setJournalTitle(journal.title);
  setJournalContent(journal.content);
};


const handleDeleteJournal = async (journal) => {
  const match = journalsWithId.find(j => j.title === journal.title && j.date === journal.date);
  if (!match) return;

  const id = match._id;
  console.log("Deleting journal with id:", id);

  const confirmed = window.confirm("Delete this journal entry?");
  if (!confirmed) return;

  try {
    await api.delete(`/journal/id/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchJournals();   // refresh displayed data
    await fetchJournals1();  // refresh _id mapping
    setMessage("Journal deleted!");
  } catch (error) {
    console.error("Error deleting journal:", error);
    setMessage("Failed to delete journal");
  }
};




  return (
    <div className="form-container" style={{ width: "500px", marginTop: "400px", marginBottom: "40px" }}>
      <Navbar />

      <h2>User Dashboard</h2>
      <h3 style={{ marginBottom: "20px" }}>{message}</h3>

      <h3 style={{ textAlign: "left" }}>Update Profile</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="New Username"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <button onClick={handleUpdate}>Update</button>

      <h3 style={{ marginTop: "30px", textAlign: "left" }}>My Journals</h3>

      <div className="form-group">
        <input
          type="text"
          placeholder="Journal Title"
          value={journalTitle}
          onChange={(e) => setJournalTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Journal Content"
          value={journalContent}
          onChange={(e) => setJournalContent(e.target.value)}
        />
      </div>

      <button onClick={handleJournalSubmit}>
        {editingId ? "Update Journal" : "Add Journal"}
      </button>

      <div style={{ marginTop: "20px", textAlign: "left" }}>
        {journals.length > 0 ? (
          journals.map((j) => {
           const realId = j._id;



            return (
              <div
                key={realId}
                style={{
                  background: "#f5f5f5",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                <strong>{j.title}</strong>
                <p>{j.content}</p>

                <button style={{ marginRight: "10px" }} onClick={() => handleEdit(j)}>
                  Edit
                </button>

                <button style={{ background: "red" }} onClick={() => handleDeleteJournal(j)}>
                  Delete
                </button>
              </div>
            );
          })
        ) : (
          <p>No journal entries found.</p>
        )}
      </div>

      <button onClick={handleDeleteUser} style={{ marginTop: "20px", background: "red" }}>
        Delete Account
      </button>

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
};

export default UserPage;
