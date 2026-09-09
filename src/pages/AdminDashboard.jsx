import { useState,useEffect } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ logout }) {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementText, setAnnouncementText] = useState("");
  const [jobCount, setJobCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
useEffect(() => {
  fetch("https://careernexus-backend-2026.onrender.com/admin/dashboard")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setStudents(data.students);
        setCompanies(data.companies);
        setJobCount(data.jobCount);
        setApplicationCount(data.applicationCount);
      }
    })
    .catch((error) => {
      console.error("Error fetching admin data:", error);
    });
}, []);
  const addAnnouncement = () => {
    if (announcementText.trim() === "") {
      alert("❌ Please enter an announcement.");
      return;
    }

    setAnnouncements([
      ...announcements,
      announcementText
    ]);

    alert("✅ Announcement published successfully!");
    setAnnouncementText("");
  };

  return (
    <div className="admin-dashboard">

      <h1>🛡️ Admin Dashboard</h1>
      <p>Placement Management Control Center</p>

      {/* Statistics */}
      <div className="stats-container">

        <div className="stat-card">
          <h2>{students.length}</h2>
          <p>🎓 Registered Students</p>
        </div>

        <div className="stat-card">
          <h2>{companies.length}</h2>
          <p>🏢 Registered Companies</p>
        </div>
        <div className="stat-card">
  <h2>{jobCount}</h2>
  <p>💼 Jobs Posted</p>
</div>
<div className="stat-card">
  <h2>{applicationCount}</h2>
  <p>📄 Applications</p>
</div>
        
      </div>

      {/* Announcement Section */}
      <div className="card">
        <h2>📢 Publish Announcement</h2>

        <textarea
          placeholder="Enter announcement..."
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
        />

        <button onClick={addAnnouncement}>
          Publish Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="card">
        <h2>📋 Recent Announcements</h2>

        {announcements.length === 0 ? (
          <p>No announcements yet.</p>
        ) : (
          announcements.map((item, index) => (
            <div key={index} className="announcement-card">
              <p>{item}</p>
            </div>
          ))
        )}
      </div>

      {/* Student Management */}
      <div className="card">
        <h2>🎓 Student Management</h2>

        {students.length === 0 ? (
          <p>No students registered yet.</p>
        ) : (
          students.map((student, index) => (
            <div key={index} className="list-card">
              <p>{student.name}</p>
            </div>
          ))
        )}
      </div>

      {/* Company Management */}
      <div className="card">
        <h2>🏢 Company Management</h2>

        {companies.length === 0 ? (
          <p>No companies registered yet.</p>
        ) : (
          companies.map((company, index) => (
            <div key={index} className="list-card">
            <p>{company.companyName}</p>
            </div>
          ))
        )}
      </div>

      {/* Logout */}
      <div className="logout-section">
        <button className="logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </div>

    </div>
  );
}

export default AdminDashboard;