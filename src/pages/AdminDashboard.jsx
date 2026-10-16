import { useState, useEffect } from "react";
import "./PlacementOfficerDashboard.css";

const API_URL = "https://careernexus-backend-2026.onrender.com";

function PlacementOfficerDashboard({ logout }) {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementText, setAnnouncementText] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [readinessFilter, setReadinessFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard information from the backend
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/placement-officer/dashboard`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Dashboard request failed (${response.status}).`
          );
        }

        const data = await response.json();

        if (data.success !== true) {
          throw new Error(
            data.message || "Unable to load dashboard data."
          );
        }

        setStudents(Array.isArray(data.students) ? data.students : []);
        setCompanies(Array.isArray(data.companies) ? data.companies : []);
        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
        setApplications(
          Array.isArray(data.applications) ? data.applications : []
        );
      } catch (err) {
        console.error("Placement Officer dashboard error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Convert skills to lowercase for comparison
  const normalizeSkills = (skills) => {
    if (Array.isArray(skills)) {
      return skills
        .filter((skill) => typeof skill === "string")
        .map((skill) => skill.trim().toLowerCase())
        .filter(Boolean);
    }

    // Also support comma-separated skills
    if (typeof skills === "string") {
      return skills
        .split(",")
        .map((skill) => skill.trim().toLowerCase())
        .filter(Boolean);
    }

    return [];
  };

  // Feature 1: Placement readiness score
  const calculateReadiness = (student) => {
    let score = 0;

    const hasResume =
      typeof student.resume === "string" &&
      student.resume.trim().length > 0;

    const hasSkills = normalizeSkills(student.skills).length > 0;

    const hasAcademicDetails =
      student.cgpa !== undefined &&
      student.cgpa !== null &&
      student.cgpa !== "" &&
      Number.isFinite(Number(student.cgpa));

    const hasContact = Boolean(student.email && student.phone);
    const hasCareerPreference = Boolean(student.preferredRole);

    if (hasResume) score += 25;
    if (hasSkills) score += 25;
    if (hasAcademicDetails) score += 20;
    if (hasContact) score += 15;
    if (hasCareerPreference) score += 15;

    return score;
  };

  // Get required skills from a job
  const getRequiredSkills = (job) => {
    if (!job) return [];

    return normalizeSkills(
      job.requiredSkills ||
        job.skillsRequired ||
        job.skills ||
        []
    );
  };

  // Feature 2: Find missing skills for a job
  const getMissingSkills = (student, job) => {
    const studentSkills = normalizeSkills(student.skills);
    const requiredSkills = getRequiredSkills(job);

    return requiredSkills.filter(
      (skill) => !studentSkills.includes(skill)
    );
  };

  // Calculate how well a student matches a job's skills
  const calculateSkillMatch = (student, job) => {
    const requiredSkills = getRequiredSkills(job);

    if (requiredSkills.length === 0) {
      return null;
    }

    const missingSkills = getMissingSkills(student, job);

    return Math.round(
      ((requiredSkills.length - missingSkills.length) /
        requiredSkills.length) *
        100
    );
  };

  // Search and filter students
  const filteredStudents = students.filter((student) => {
    const search = searchText.trim().toLowerCase();

    const matchesSearch =
      (student.name || "").toLowerCase().includes(search) ||
      (student.email || "").toLowerCase().includes(search) ||
      (student.department || "").toLowerCase().includes(search);

    const readiness = calculateReadiness(student);

    let matchesReadiness = true;

    if (readinessFilter === "ready") {
      matchesReadiness = readiness >= 75;
    } else if (readinessFilter === "training") {
      matchesReadiness = readiness >= 40 && readiness < 75;
    } else if (readinessFilter === "incomplete") {
      matchesReadiness = readiness < 40;
    }

    const job =
      selectedJob === "all"
        ? null
        : jobs.find((item) => item._id === selectedJob);

    const skillMatch = calculateSkillMatch(student, job);

    const matchesJob =
      selectedJob === "all" ||
      (skillMatch !== null && skillMatch > 0);

    return matchesSearch && matchesReadiness && matchesJob;
  });

  // Open resume viewer
  const handleViewResume = (student) => {
    if (!student.resume) {
      alert("This student has not uploaded a resume.");
      return;
    }

    setSelectedResume(student);
  };

  // Close resume viewer
  const handleCloseResume = () => {
    setSelectedResume(null);
  };

  // Add announcement for the current session
  const addAnnouncement = () => {
    if (!announcementText.trim()) {
      alert("Please enter an announcement.");
      return;
    }

    setAnnouncements((previous) => [
      {
        id: Date.now(),
        text: announcementText.trim(),
        date: new Date().toLocaleDateString(),
      },
      ...previous,
    ]);

    setAnnouncementText("");

    alert(
      "Announcement added for this session. A backend API is needed to save it permanently."
    );
  };

  const readyStudents = students.filter(
    (student) => calculateReadiness(student) >= 75
  ).length;

  const uploadedResumes = students.filter(
    (student) =>
      typeof student.resume === "string" &&
      student.resume.trim().length > 0
  ).length;

  if (loading) {
    return (
      <div className="po-dashboard">
        <h2>Loading Placement Officer Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="po-dashboard">
      <header className="po-header">
        <div>
          <h1>🎓 Placement Officer Dashboard</h1>
          <p>CareerNexus Placement Management System</p>
        </div>

        <button
          type="button"
          className="po-logout-btn"
          onClick={logout}
        >
          🚪 Logout
        </button>
      </header>

      {error && (
        <div className="po-error">
          <h3>Unable to load dashboard data</h3>
          <p>{error}</p>
          <p>
            The backend must provide the
            /placement-officer/dashboard endpoint.
          </p>
        </div>
      )}

      {/* Dashboard statistics */}
      <section className="po-stats">
        <div className="po-stat-card">
          <h2>{students.length}</h2>
          <p>🎓 Total Students</p>
        </div>

        <div className="po-stat-card">
          <h2>{companies.length}</h2>
          <p>🏢 Companies</p>
        </div>

        <div className="po-stat-card">
          <h2>{jobs.length}</h2>
          <p>💼 Available Jobs</p>
        </div>

        <div className="po-stat-card">
          <h2>{applications.length}</h2>
          <p>📄 Applications</p>
        </div>

        <div className="po-stat-card">
          <h2>{uploadedResumes}</h2>
          <p>📑 Resumes Uploaded</p>
        </div>

        <div className="po-stat-card">
          <h2>{readyStudents}</h2>
          <p>✅ Placement Ready</p>
        </div>
      </section>

      {/* Feature 1: Read-only resume viewer */}
      <section className="po-card">
        <h2>📄 Student Resume Management</h2>
        <p>Search student profiles and view uploaded resumes.</p>

        <input
          type="text"
          className="po-search"
          placeholder="Search by name, email, or department..."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        <div className="po-filter-row">
          <select
            value={readinessFilter}
            onChange={(event) => setReadinessFilter(event.target.value)}
          >
            <option value="all">All Readiness Levels</option>
            <option value="ready">Ready (75% and above)</option>
            <option value="training">Needs Improvement (40–74%)</option>
            <option value="incomplete">Incomplete (below 40%)</option>
          </select>

          <select
            value={selectedJob}
            onChange={(event) => setSelectedJob(event.target.value)}
          >
            <option value="all">All Jobs</option>

            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title || job.jobTitle || "Untitled Job"}
              </option>
            ))}
          </select>
        </div>

        {filteredStudents.length === 0 ? (
          <p>No matching students found.</p>
        ) : (
          <div className="po-table-wrapper">
            <table className="po-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Department</th>
                  <th>CGPA</th>
                  <th>Skills</th>
                  <th>Readiness and Skill Match</th>
                  <th>Resume</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => {
                  const readiness = calculateReadiness(student);

                  const job =
                    selectedJob === "all"
                      ? null
                      : jobs.find((item) => item._id === selectedJob);

                  const missingSkills = job
                    ? getMissingSkills(student, job)
                    : [];

                  const skillMatch = job
                    ? calculateSkillMatch(student, job)
                    : null;

                  return (
                    <tr key={student._id || student.email}>
                      <td>
                        <strong>{student.name || "Unknown"}</strong>
                        <small>{student.email}</small>
                      </td>

                      <td>{student.department || "N/A"}</td>
                      <td>{student.cgpa ?? "N/A"}</td>

                      <td>
                        {normalizeSkills(student.skills).length
                          ? normalizeSkills(student.skills).join(", ")
                          : "No skills added"}
                      </td>

                      <td>
                        <div className="po-score">
                          <strong>{readiness}%</strong>

                          <div className="po-progress">
                            <div
                              className="po-progress-fill"
                              style={{ width: `${readiness}%` }}
                            />
                          </div>

                          <span>
                            {readiness >= 75
                              ? "Ready"
                              : readiness >= 40
                              ? "Needs Improvement"
                              : "Incomplete"}
                          </span>
                        </div>

                        {job && (
                          <div className="po-skill-gap">
                            <strong>
                              Skill Match:{" "}
                              {skillMatch === null
                                ? "N/A"
                                : `${skillMatch}%`}
                            </strong>

                            {skillMatch !== null &&
                              (missingSkills.length > 0 ? (
                                <p>
                                  Missing: {missingSkills.join(", ")}
                                </p>
                              ) : (
                                <p>All required skills matched.</p>
                              ))}

                            {skillMatch === null && (
                              <p>
                                No required skills are listed for this job.
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="po-view-btn"
                          onClick={() => handleViewResume(student)}
                          disabled={!student.resume}
                        >
                          {student.resume
                            ? "👁️ View Resume"
                            : "Not Uploaded"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Feature 2: Smart placement readiness analyzer */}
      <section className="po-card">
        <h2>🎯 Placement Readiness & Skill Gap Analyzer</h2>

        <p>
          Readiness estimates whether a student's profile is complete.
          Select a job above to compare student skills with its required
          skills.
        </p>

        <div className="po-readiness-summary">
          <div>
            <h3>{readyStudents}</h3>
            <p>Ready Students</p>
          </div>

          <div>
            <h3>{students.length - readyStudents}</h3>
            <p>Students Needing Improvement</p>
          </div>

          <div>
            <h3>{students.length - uploadedResumes}</h3>
            <p>Missing Resumes</p>
          </div>
        </div>

        <p className="po-note">
          Readiness is an estimate, not a guarantee of placement or job
          eligibility. Verify each job's actual eligibility criteria.
        </p>
      </section>

      {/* Company information */}
      <section className="po-card">
        <h2>🏢 Company Management</h2>

        {companies.length === 0 ? (
          <p>No companies found.</p>
        ) : (
          companies.map((company) => (
            <div
              key={company._id || company.companyName}
              className="po-list-item"
            >
              <strong>{company.companyName || "Company"}</strong>
              <span>{company.email || ""}</span>
            </div>
          ))
        )}
      </section>

      {/* Announcements */}
      <section className="po-card">
        <h2>📢 Publish Announcement</h2>

        <textarea
          className="po-announcement-input"
          placeholder="Enter placement announcement..."
          value={announcementText}
          onChange={(event) => setAnnouncementText(event.target.value)}
        />

        <button
          type="button"
          className="po-primary-btn"
          onClick={addAnnouncement}
        >
          Publish Announcement
        </button>

        <h3>Recent Announcements</h3>

        {announcements.length === 0 ? (
          <p>No announcements in this session.</p>
        ) : (
          announcements.map((announcement) => (
            <div className="po-list-item" key={announcement.id}>
              <div>
                <p>{announcement.text}</p>
                <small>{announcement.date}</small>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Read-only resume modal */}
      {selectedResume && (
        <div
          className="po-resume-overlay"
          onClick={handleCloseResume}
        >
          <div
            className="po-resume-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="po-resume-header">
              <div>
                <h2>📄 Student Resume</h2>
                <p>{selectedResume.name}</p>
              </div>

              <button
                type="button"
                className="po-close-btn"
                onClick={handleCloseResume}
              >
                ✖ Close
              </button>
            </div>

            <iframe
              title={`${selectedResume.name || "Student"} Resume`}
              src={selectedResume.resume}
              className="po-resume-frame"
            />

            <p className="po-note">
              The resume is displayed for review. Browser settings cannot
              guarantee that copying or downloading is prevented.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacementOfficerDashboard;