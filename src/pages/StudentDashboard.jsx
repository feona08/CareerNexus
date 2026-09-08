import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";

function StudentDashboard({ student, logout }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [cgpa, setCgpa] = useState("");

  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const [profilePicture, setProfilePicture] = useState(null);
  const [resume, setResume] = useState(null);
  const [certificate, setCertificate] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [interviews, setInterviews] = useState([]);
  const [interviewCompany, setInterviewCompany] = useState("");
  const [interviewDate, setInterviewDate] = useState("");

  useEffect(() => {
    if (student) {
      setName(student.name || "");
      setEmail(student.email || "");
      setDepartment(student.department || "");
      setYear(student.year || "");
      setCgpa(student.cgpa || "");
      setLinkedin(student.linkedin || "");
      setGithub(student.github || "");
      setSkills(student.skills || []);
      setInterviews(student.interviews || []);
    }
  }, [student]);

  /* ---------------- LOAD JOBS ---------------- */

  useEffect(() => {
    fetch("http://localhost:5000/job/all")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setJobs(data.jobs || []);
        }
      })
      .catch((error) => {
        console.error("Error loading jobs:", error);
      });
  }, []);

  /* ---------------- LOAD APPLICATIONS ---------------- */

  useEffect(() => {
    if (!email) return;

    fetch("http://localhost:5000/application/all")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const studentApplications = (data.applications || []).filter(
            (application) => application.studentEmail === email
          );

          setApplications(studentApplications);
        }
      })
      .catch((error) => {
        console.error("Error loading applications:", error);
      });
  }, [email]);

  /* ---------------- RESUME ---------------- */

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("❌ Please upload a PDF, DOC or DOCX file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("❌ Resume size must be less than 2 MB.");
      return;
    }

    setResume(file);
    alert("✅ Resume selected successfully.");
  };

  /* ---------------- CERTIFICATE ---------------- */

  const handleCertificateUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setCertificate(file);
    alert("✅ Certification selected successfully.");
  };

  /* ---------------- PROFILE PICTURE ---------------- */

  const handleProfilePicture = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setProfilePicture(file);
  };

  /* ---------------- SKILLS ---------------- */

  const addSkill = () => {
    const trimmedSkill = newSkill.trim();

    if (!trimmedSkill) {
      alert("Please enter a skill.");
      return;
    }

    if (skills.includes(trimmedSkill)) {
      alert("Skill already added.");
      return;
    }

    setSkills([...skills, trimmedSkill]);
    setNewSkill("");
  };

  const deleteSkill = (skillToDelete) => {
    setSkills(
      skills.filter((skill) => skill !== skillToDelete)
    );
  };

  /* ---------------- INTERVIEWS ---------------- */

  const addInterview = () => {
    if (!interviewCompany.trim() || !interviewDate) {
      alert("Please enter company and interview date.");
      return;
    }

    const newInterview = {
      company: interviewCompany,
      date: interviewDate,
    };

    setInterviews([...interviews, newInterview]);

    setInterviewCompany("");
    setInterviewDate("");

    alert("✅ Interview scheduled successfully.");
  };

  const deleteInterview = (index) => {
    setInterviews(
      interviews.filter((_, interviewIndex) => interviewIndex !== index)
    );
  };

  /* ---------------- APPLY FOR JOB ---------------- */

  const applyForJob = async (job) => {
    if (!student?.id) {
      alert("Student information not available.");
      return;
    }

    const alreadyApplied = applications.some(
      (application) =>
        application.jobId === job._id ||
        application.jobId?._id === job._id
    );

    if (alreadyApplied) {
      alert("⚠️ You have already applied for this job.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/application/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentName: name,
            studentEmail: email,
            jobId: job._id,
            jobTitle: job.title,
            companyName: job.companyName,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("✅ Application submitted successfully.");

        setApplications((previous) => [
          ...previous,
          data.application || {
            studentName: name,
            studentEmail: email,
            jobId: job._id,
            jobTitle: job.title,
            companyName: job.companyName,
            status: "Applied",
          },
        ]);
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Application error:", error);
      alert("❌ Server connection failed.");
    }
  };

  /* ---------------- SAVE DETAILS ---------------- */

  const submitDetails = async () => {
    if (!student?.id) {
      alert("Student information not available.");
      return;
    }

    if (!name || !email || !department || !year || !cgpa) {
      alert("❌ Please complete your profile details.");
      return;
    }

    if (!profilePicture) {
      alert("❌ Please select a profile picture.");
      return;
    }

    if (!resume) {
      alert("❌ Please select your resume.");
      return;
    }

    if (!certificate) {
      alert("❌ Please select a certification.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/student/update/${student.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department,
            year,
            cgpa,
            linkedin,
            github,
            skills,
            interviews,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("✅ Student details updated successfully.");
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Server connection failed.");
    }
  };

  /* ---------------- READINESS SCORE ---------------- */

  let readinessScore = 0;

  if (name) readinessScore += 15;
  if (email) readinessScore += 10;
  if (department) readinessScore += 10;
  if (year) readinessScore += 10;
  if (cgpa) readinessScore += 15;
  if (resume) readinessScore += 15;
  if (certificate) readinessScore += 10;
  if (linkedin) readinessScore += 5;
  if (github) readinessScore += 5;
  if (skills.length > 0) readinessScore += 5;

  const shortlistedCount = applications.filter(
    (application) =>
      application.status?.toLowerCase() === "shortlisted"
  ).length;

  const profileImageUrl = profilePicture
    ? URL.createObjectURL(profilePicture)
    : null;

  return (
    <div className="student-dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard-sidebar">

        <div className="sidebar-logo">
          <h2>Career Nexus</h2>
          <span>Placement Platform</span>
        </div>

        <nav className="sidebar-nav">

          <a href="#overview" className="nav-link active">
            <span>01</span>
            Overview
          </a>

          <a href="#profile" className="nav-link">
            <span>02</span>
            My Profile
          </a>

          <a href="#jobs" className="nav-link">
            <span>03</span>
            Find Jobs
          </a>

          <a href="#applications" className="nav-link">
            <span>04</span>
            Applications
          </a>

          <a href="#interviews" className="nav-link">
            <span>05</span>
            Interviews
          </a>

          <a href="#documents" className="nav-link">
            <span>06</span>
            Documents
          </a>

        </nav>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        <div className="dashboard-content">

          {/* ================= TOP HEADER ================= */}

          <header className="dashboard-topbar">

            <div>
              <h1>Student Dashboard</h1>
              <p>Manage your placement journey</p>
            </div>

            <div className="student-badge">
              🎓 Student
            </div>

          </header>

          {/* ================= WELCOME ================= */}

          <section
            className="hero-card"
            id="overview"
          >
            <h2>
              Welcome back, {name || "Student"} 👋
            </h2>

            <p>
              Your placement journey at a glance.
            </p>
          </section>

          {/* ================= STATS ================= */}

          <section className="stats-grid">

            <div className="stat-card">
              <span className="stat-icon">💼</span>
              <strong>{jobs.length.toString().padStart(2, "0")}</strong>
              <span>Jobs</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon">📄</span>
              <strong>
                {applications.length.toString().padStart(2, "0")}
              </strong>
              <span>Applications</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon">⭐</span>
              <strong>
                {shortlistedCount.toString().padStart(2, "0")}
              </strong>
              <span>Shortlisted</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon">📅</span>
              <strong>
                {interviews.length.toString().padStart(2, "0")}
              </strong>
              <span>Interviews</span>
            </div>

          </section>

          {/* ================= PROFILE ================= */}

          <section
            className="dashboard-section profile-section"
            id="profile"
          >

            <h2 className="section-title">
              My Profile
            </h2>

            <div className="profile-readiness-grid">

              {/* PROFILE CARD */}

              <div className="profile-card">

                <div className="card-heading">
                  <div>
                    <h3>Your Profile</h3>
                    <p>Keep your information updated.</p>
                  </div>

                  <div className="profile-avatar">

                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt="Profile"
                      />
                    ) : (
                      <span>👤</span>
                    )}

                  </div>
                </div>

                <div className="profile-fields">

                  <div className="field-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="field-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                    />
                  </div>

                  <div className="field-group">
                    <label>Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) =>
                        setDepartment(e.target.value)
                      }
                      placeholder="e.g. Computer Science"
                    />
                  </div>

                  <div className="field-group">
                    <label>Year</label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) =>
                        setYear(e.target.value)
                      }
                      placeholder="e.g. Final Year"
                    />
                  </div>

                  <div className="field-group">
                    <label>CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      value={cgpa}
                      onChange={(e) =>
                        setCgpa(e.target.value)
                      }
                      placeholder="e.g. 8.50"
                    />
                  </div>

                </div>

              </div>

              {/* READINESS CARD */}

              <div className="readiness-card">

                <div className="readiness-header">
                  <h3>Placement Readiness</h3>
                  <span>Profile strength</span>
                </div>

                <div
                  className="readiness-circle"
                  style={{
                    "--score": `${readinessScore * 3.6}deg`,
                  }}
                >
                  <div className="readiness-inner">
                    <strong>{readinessScore}%</strong>
                    <span>Ready</span>
                  </div>
                </div>

                <div className="readiness-message">

                  {readinessScore >= 80 ? (
                    <>
                      <strong>Excellent profile!</strong>
                      <p>
                        You are well prepared for placement opportunities.
                      </p>
                    </>
                  ) : readinessScore >= 50 ? (
                    <>
                      <strong>Good progress!</strong>
                      <p>
                        Complete a few more profile sections.
                      </p>
                    </>
                  ) : (
                    <>
                      <strong>Let's get started!</strong>
                      <p>
                        Complete your profile to improve your readiness.
                      </p>
                    </>
                  )}

                </div>

              </div>

            </div>

          </section>

          {/* ================= JOBS ================= */}

          <section
            className="dashboard-section"
            id="jobs"
          >

            <h2 className="section-title">
              Find Jobs
            </h2>

            {jobs.length === 0 ? (

              <div className="empty-state">
                <span>💼</span>
                <h3>No jobs available</h3>
                <p>
                  New placement opportunities will appear here.
                </p>
              </div>

            ) : (

              <div className="jobs-grid">

                {jobs.map((job) => {

                  const alreadyApplied = applications.some(
                    (application) =>
                      application.jobId === job._id ||
                      application.jobId?._id === job._id
                  );

                  return (
                    <div
                      className="job-card"
                      key={job._id}
                    >

                      <div className="job-top">

                        <div className="company-logo">
                          🏢
                        </div>

                        <span className="job-type">
                          Open
                        </span>

                      </div>

                      <h3>{job.title}</h3>

                      <p className="company-name">
                        {job.companyName}
                      </p>

                      <div className="job-info">

                        <span>
                          📍 {job.location || "Not specified"}
                        </span>

                        <span>
                          💰 {job.package || "Package not specified"}
                        </span>

                      </div>

                      <button
                        className={
                          alreadyApplied
                            ? "apply-btn applied"
                            : "apply-btn"
                        }
                        disabled={alreadyApplied}
                        onClick={() => applyForJob(job)}
                      >
                        {alreadyApplied
                          ? "✓ Applied"
                          : "Apply Now"}
                      </button>

                    </div>
                  );
                })}

              </div>

            )}

          </section>

          {/* ================= APPLICATIONS ================= */}

          <section
            className="dashboard-section"
            id="applications"
          >

            <h2 className="section-title">
              Applications
            </h2>

            {applications.length === 0 ? (

              <div className="empty-state">
                <span>📄</span>
                <h3>No applications yet</h3>
                <p>
                  Apply for a job to start tracking your applications.
                </p>
              </div>

            ) : (

              <div className="applications-list">

                {applications.map((application) => (

                  <div
                    className="application-card"
                    key={application._id || application.jobId}
                  >

                    <div className="application-company">
                      <div className="small-company-logo">
                        🏢
                      </div>

                      <div>
                        <strong>
                          {application.companyName}
                        </strong>

                        <span>
                          {application.jobTitle}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`status status-${(
                        application.status || "Applied"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {application.status || "Applied"}
                    </span>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* ================= INTERVIEWS ================= */}

          <section
            className="dashboard-section"
            id="interviews"
          >

            <h2 className="section-title">
              Interviews
            </h2>

            <div className="interview-grid">

              {/* SCHEDULE */}

              <div className="interview-card">

                <div className="card-heading">
                  <div>
                    <h3>Schedule Interview</h3>
                    <p>Add an upcoming interview.</p>
                  </div>

                  <span className="card-icon">
                    📅
                  </span>
                </div>

                <div className="field-group">
                  <label>Company</label>

                  <input
                    type="text"
                    value={interviewCompany}
                    onChange={(e) =>
                      setInterviewCompany(e.target.value)
                    }
                    placeholder="Enter company name"
                  />
                </div>

                <div className="field-group">
                  <label>Interview Date</label>

                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) =>
                      setInterviewDate(e.target.value)
                    }
                  />
                </div>

                <button
                  className="primary-btn"
                  onClick={addInterview}
                >
                  + Add Interview
                </button>

              </div>

              {/* UPCOMING */}

              <div className="upcoming-card">

                <div className="card-heading">
                  <div>
                    <h3>Upcoming Interviews</h3>
                    <p>Your scheduled placement interviews.</p>
                  </div>
                </div>

                {interviews.length === 0 ? (

                  <div className="empty-small">
                    <span>📅</span>
                    <p>No upcoming interviews.</p>
                  </div>

                ) : (

                  <div className="interview-list">

                    {interviews.map((interview, index) => (

                      <div
                        className="interview-item"
                        key={index}
                      >

                        <div className="interview-date">
                          <span>
                            {new Date(
                              interview.date
                            ).getDate()}
                          </span>

                          <small>
                            {new Date(
                              interview.date
                            ).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </small>
                        </div>

                        <div className="interview-details">
                          <strong>
                            {interview.company}
                          </strong>

                          <span>
                            Interview scheduled
                          </span>
                        </div>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteInterview(index)
                          }
                        >
                          ×
                        </button>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </section>

          {/* ================= DOCUMENTS ================= */}

          <section
            className="dashboard-section"
            id="documents"
          >

            <h2 className="section-title">
              Documents
            </h2>

            <div className="documents-grid">

              {/* RESUME */}

              <div className="document-card">

                <div className="document-icon">
                  📄
                </div>

                <h3>Resume</h3>

                <p>
                  {resume
                    ? resume.name
                    : "PDF, DOC or DOCX · Max 2 MB"}
                </p>

                <label className="upload-btn">
                  {resume ? "Change Resume" : "Upload Resume"}

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                  />
                </label>

              </div>

              {/* CERTIFICATE */}

              <div className="document-card">

                <div className="document-icon">
                  🏆
                </div>

                <h3>Certification</h3>

                <p>
                  {certificate
                    ? certificate.name
                    : "Add your professional certificate"}
                </p>

                <label className="upload-btn">
                  {certificate
                    ? "Change Certificate"
                    : "Upload Certificate"}

                  <input
                    type="file"
                    onChange={handleCertificateUpload}
                  />
                </label>

              </div>

              {/* PROFILE PICTURE */}

              <div className="document-card">

                <div className="document-icon">
                  👤
                </div>

                <h3>Profile Picture</h3>

                <p>
                  {profilePicture
                    ? profilePicture.name
                    : "Use a professional profile picture"}
                </p>

                <label className="upload-btn">
                  {profilePicture
                    ? "Change Picture"
                    : "Select Picture"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicture}
                  />
                </label>

              </div>

            </div>

          </section>

          {/* ================= SKILLS & LINKS ================= */}

          <section className="dashboard-section">

            <h2 className="section-title">
              Skills & Links
            </h2>

            <div className="skills-links-grid">

              {/* SKILLS */}

              <div className="skills-card">

                <div className="card-heading">
                  <div>
                    <h3>Skills</h3>
                    <p>Add skills that represent your strengths.</p>
                  </div>

                  <span className="card-icon">
                    ⚡
                  </span>
                </div>

                <div className="skill-input-row">

                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) =>
                      setNewSkill(e.target.value)
                    }
                    placeholder="e.g. React"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addSkill();
                      }
                    }}
                  />

                  <button
                    className="add-btn"
                    onClick={addSkill}
                  >
                    Add
                  </button>

                </div>

                <div className="skills-list">

                  {skills.length === 0 ? (

                    <span className="no-skills">
                      No skills added yet.
                    </span>

                  ) : (

                    skills.map((skill) => (

                      <span
                        className="skill-tag"
                        key={skill}
                      >
                        {skill}

                        <button
                          onClick={() =>
                            deleteSkill(skill)
                          }
                        >
                          ×
                        </button>

                      </span>

                    ))

                  )}

                </div>

              </div>

              {/* LINKS */}

              <div className="skills-card">

                <div className="card-heading">
                  <div>
                    <h3>Professional Links</h3>
                    <p>Connect your professional profiles.</p>
                  </div>

                  <span className="card-icon">
                    🔗
                  </span>
                </div>

                <div className="field-group">

                  <label>LinkedIn</label>

                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) =>
                      setLinkedin(e.target.value)
                    }
                    placeholder="https://linkedin.com/in/username"
                  />

                </div>

                <div className="field-group">

                  <label>GitHub</label>

                  <input
                    type="url"
                    value={github}
                    onChange={(e) =>
                      setGithub(e.target.value)
                    }
                    placeholder="https://github.com/username"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* ================= SAVE ================= */}

          <section className="save-section">

            <div>
              <h3>Ready to save your profile?</h3>

              <p>
                Make sure your details, documents and professional
                links are up to date.
              </p>
            </div>

            <button
              className="save-btn"
              onClick={submitDetails}
            >
              Save Profile
            </button>

          </section>

          {/* ================= FOOTER ================= */}

          <footer className="dashboard-footer">

            <strong>
              Career Nexus
            </strong>

            <span>
              Smart Campus Placement & Recruitment Platform
            </span>

          </footer>

        </div>

      </main>

    </div>
  );
}

export default StudentDashboard;