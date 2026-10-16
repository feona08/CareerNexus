import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";

function StudentDashboard({ student, logout }) {
  // ================= BASIC DETAILS =================
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [cgpa, setCgpa] = useState("");

  // ================= PERSONAL DETAILS =================
  const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
 const [dateOfBirth, setDateOfBirth] = useState("");
 const [gender, setGender] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("");
const [pinCode, setPinCode] = useState("");
 

  // ================= ACADEMIC DETAILS =================
  const [tenthSchool, setTenthSchool] = useState("");
  const [tenthBoard, setTenthBoard] = useState("");
  const [tenthYear, setTenthYear] = useState("");
  const [tenthPercentage, setTenthPercentage] = useState("");

  const [pucCollege, setPucCollege] = useState("");
  const [pucBoard, setPucBoard] = useState("");
  const [pucYear, setPucYear] = useState("");
  const [pucPercentage, setPucPercentage] = useState("");

  const [ugDegree, setUgDegree] = useState("");
  const [ugUniversity, setUgUniversity] = useState("");
  const [ugSpecialization, setUgSpecialization] = useState("");
  const [ugYear, setUgYear] = useState("");
  const [ugCgpa, setUgCgpa] = useState("");

  const [pgDegree, setPgDegree] = useState("");
  const [pgUniversity, setPgUniversity] = useState("");
  const [pgSpecialization, setPgSpecialization] = useState("");
  const [pgYear, setPgYear] = useState("");
  const [pgCgpa, setPgCgpa] = useState("");

  // ================= AREAS OF INTEREST =================
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
const [preferredLocation, setPreferredLocation] = useState("");
const [workPreference, setWorkPreference] = useState("");

  // ================= SKILLS & LINKS =================
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [skills, setSkills] = useState([]);

  const [newSkill, setNewSkill] = useState("");
// Smart Job Matching System
const getJobMatch = (job) => {
  const studentSkills = skills
    .map((skill) => skill.trim().toLowerCase())
    .filter(Boolean);

  const requiredSkills = (job.skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const matchedSkills = requiredSkills.filter((skill) =>
    studentSkills.includes(skill.toLowerCase())
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !studentSkills.includes(skill.toLowerCase())
  );

  const matchPercentage =
    requiredSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
  };
};
  // ================= DOCUMENTS =================
  const [profilePicture, setProfilePicture] = useState(null);
  const [resume, setResume] = useState(null);
  const [certificate, setCertificate] = useState(null);

  // ================= JOBS & APPLICATIONS =================
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  // ================= INTERVIEWS =================
  const [interviews, setInterviews] = useState([]);
  const [interviewCompany, setInterviewCompany] = useState("");
  const [interviewDate, setInterviewDate] = useState("");

  // ================= CURRENT PAGE =================
  const [activePage, setActivePage] = useState("overview");

  // ================= LOAD STUDENT =================
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

  // ================= LOAD JOBS =================
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

  // ================= LOAD APPLICATIONS =================
  useEffect(() => {
    if (!email) return;

fetch("http://localhost:5000/application/all")      .then((response) => response.json())
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

  // ================= RESUME =================
  const handleResumeUpload = async (event) => {
  const file = event.target.files[0];

  if (!file) return;

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

  try {
    const formData = new FormData();
    formData.append("resume", file);
console.log("Uploading resume to local backend:", student.id);
    const response = await fetch(
`http://localhost:5000/student/upload-resume/${student.id}`,      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      setResume(file);
      alert("✅ Resume uploaded successfully.");
    } else {
      alert(`❌ ${data.message}`);
    }
  } catch (error) {
    console.error("Resume upload error:", error);
    alert("❌ Resume upload failed.");
  }
};

  // ================= CERTIFICATE =================
  const handleCertificateUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setCertificate(file);
    alert("✅ Certification selected successfully.");
  };

  // ================= PROFILE PICTURE =================
  const handleProfilePicture = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setProfilePicture(file);
  };

  // ================= SKILLS =================
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
    setSkills(skills.filter((skill) => skill !== skillToDelete));
  };

  // ================= INTERESTS =================
  const addInterest = () => {
    const trimmedInterest = newInterest.trim();

    if (!trimmedInterest) {
      alert("Please enter an area of interest.");
      return;
    }

    if (interests.includes(trimmedInterest)) {
      alert("Interest already added.");
      return;
    }

    setInterests([...interests, trimmedInterest]);
    setNewInterest("");
  };

  const deleteInterest = (interestToDelete) => {
    setInterests(
      interests.filter((interest) => interest !== interestToDelete)
    );
  };

  // ================= INTERVIEWS =================
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

  // ================= APPLY FOR JOB =================
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
      console.log("APPLICATION DATA:", {
  studentName: name,
  studentEmail: email,
  jobId: job._id,
jobTitle: job.title,  
companyName: job.companyName,
});
      const response = await fetch(
"http://localhost:5000/application/apply", {        
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  studentName: name,
  studentEmail: email,
  jobId: job._id,
  jobTitle: job.jobTitle,
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
            jobTitle: job.jobTitle,
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

  // ================= SAVE PROFILE =================
  const submitDetails = async () => {
    if (!student?.id) {
      alert("Student information not available.");
      return;
    }

    try {
      const response = await fetch(
        `https://careernexus-backend-2026.onrender.com/student/update/${student.id}`,
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

  // ================= READINESS =================
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

  // ================= PAGE TITLE =================
  const getPageTitle = () => {
    switch (activePage) {
      case "personal":
        return "Personal Details";
      case "academic":
        return "Academic Details";
      case "interest":
        return "Areas of Interest";
      case "jobs":
        return "Find Jobs";
      case "applications":
        return "Applications";
      case "interviews":
        return "Interviews";
      case "documents":
        return "Documents";
      default:
        return "Student Dashboard";
    }
  };

  return (
    <div className="student-dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard-sidebar">

        <div className="sidebar-logo">
          <h2>Career Nexus</h2>
          <span>Placement Platform</span>
        </div>

        <nav className="sidebar-nav">

          <button
            className={`nav-link ${
              activePage === "overview" ? "active" : ""
            }`}
            onClick={() => setActivePage("overview")}
          >
            <span>01</span>
            Overview
          </button>

          <button
            className={`nav-link ${
              activePage === "personal" ? "active" : ""
            }`}
            onClick={() => setActivePage("personal")}
          >
            <span>02</span>
            Personal Details
          </button>

          <button
            className={`nav-link ${
              activePage === "academic" ? "active" : ""
            }`}
            onClick={() => setActivePage("academic")}
          >
            <span>03</span>
            Academic Details
          </button>

          <button
            className={`nav-link ${
              activePage === "interest" ? "active" : ""
            }`}
            onClick={() => setActivePage("interest")}
          >
            <span>04</span>
            Areas of Interest
          </button>

          <button
            className={`nav-link ${
              activePage === "jobs" ? "active" : ""
            }`}
            onClick={() => setActivePage("jobs")}
          >
            <span>05</span>
            Find Jobs
          </button>

          <button
            className={`nav-link ${
              activePage === "applications" ? "active" : ""
            }`}
            onClick={() => setActivePage("applications")}
          >
            <span>06</span>
            Applications
          </button>

          <button
            className={`nav-link ${
              activePage === "interviews" ? "active" : ""
            }`}
            onClick={() => setActivePage("interviews")}
          >
            <span>07</span>
            Interviews
          </button>

          <button
            className={`nav-link ${
              activePage === "documents" ? "active" : ""
            }`}
            onClick={() => setActivePage("documents")}
          >
            <span>08</span>
            Documents
          </button>

        </nav>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        <div className="dashboard-content">

          {/* ================= TOP HEADER ================= */}

          <header className="dashboard-topbar">

            <div>
              <h1>{getPageTitle()}</h1>
              <p>
                {activePage === "overview"
                  ? "Manage your placement journey"
                  : "Keep your information updated"}
              </p>
            </div>

            <div className="student-badge">
              🎓 Student
            </div>

          </header>


          {/* =====================================================
              OVERVIEW
          ===================================================== */}

          {activePage === "overview" && (
            <>
              <section className="hero-card">
                <h2>
                  Welcome back, {name || "Student"} 👋
                </h2>

                <p>
                  Your placement journey at a glance.
                </p>
              </section>

              <section className="stats-grid">

                <div className="stat-card">
                  <span className="stat-icon">💼</span>
                  <strong>
                    {jobs.length.toString().padStart(2, "0")}
                  </strong>
                  <span>Jobs</span>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">📄</span>
                  <strong>
                    {applications.length
                      .toString()
                      .padStart(2, "0")}
                  </strong>
                  <span>Applications</span>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">⭐</span>
                  <strong>
                    {shortlistedCount
                      .toString()
                      .padStart(2, "0")}
                  </strong>
                  <span>Shortlisted</span>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">📅</span>
                  <strong>
                    {interviews.length
                      .toString()
                      .padStart(2, "0")}
                  </strong>
                  <span>Interviews</span>
                </div>

              </section>

              <section className="dashboard-section">

                <h2 className="section-title">
                  Placement Readiness
                </h2>

                <div className="readiness-card">

                  <div className="readiness-header">
                    <h3>Profile Strength</h3>
                    <span>Your current readiness</span>
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

              </section>
            </>
          )}


          {/* =====================================================
              PERSONAL DETAILS
          ===================================================== */}

          {activePage === "personal" && (
  <section className="dashboard-section">

    <h2 className="section-title">
      Personal Details
    </h2>

    <div className="profile-card">

      <div className="card-heading">
        <div>
          <h3>Personal Information</h3>
          <p>Keep your personal information up to date.</p>
        </div>

        <div className="profile-avatar">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="Profile" />
          ) : (
            <span>👤</span>
          )}
        </div>
      </div>

      <div className="profile-fields">

        {/* FIRST NAME */}
        <div className="field-group">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
          />
        </div>

        {/* LAST NAME */}
        <div className="field-group">
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
          />
        </div>

        {/* EMAIL */}
        <div className="field-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            disabled
          />
        </div>

        {/* PHONE */}
        <div className="field-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        {/* GENDER */}
        <div className="field-group">
          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {/* DATE OF BIRTH */}
        <div className="field-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>

        {/* ADDRESS */}
        <div className="field-group">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
          />
        </div>

        {/* CITY */}
        <div className="field-group">
          <label>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city"
          />
        </div>

        {/* STATE */}
        <div className="field-group">
          <label>State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter your state"
          />
        </div>

        {/* PIN CODE */}
        <div className="field-group">
          <label>PIN Code</label>
          <input
            type="text"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            placeholder="Enter PIN code"
            maxLength="6"
          />
        </div>

      </div>

      <button
  className="primary-btn"
  onClick={async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !phone.trim() ||
      !gender ||
      !dateOfBirth ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pinCode.trim()
    ) {
      alert("❌ Please fill in all personal details.");
      return;
    }

    if (pinCode.length !== 6 || isNaN(pinCode)) {
      alert("❌ Please enter a valid 6-digit PIN code.");
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
            firstName,
            lastName,
            phone,
            gender,
            dateOfBirth,
            address,
            city,
            state,
            pinCode,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("✅ Personal details saved successfully.");
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Server error. Please try again.");
    }
  }}
>
  Save Personal Details
</button>
    </div>

  </section>

)}
{activePage === "academic" && (
  <section className="dashboard-section">

    <h2 className="section-title">
      Academic Details
    </h2>

    {/* 10th / SSLC */}
    <div className="profile-card">

      <div className="card-heading">
        <div>
          <h3>10th / SSLC</h3>
          <p>Enter your secondary school details.</p>
        </div>
        <span className="card-icon">📘</span>
      </div>

      <div className="profile-fields">

        <div className="field-group">
          <label>School Name</label>
          <input
            type="text"
            value={tenthSchool}
            onChange={(e) => setTenthSchool(e.target.value)}
            placeholder="Enter school name"
          />
        </div>

        <div className="field-group">
          <label>Board</label>
          <input
            type="text"
            value={tenthBoard}
            onChange={(e) => setTenthBoard(e.target.value)}
            placeholder="e.g. CBSE / State Board"
          />
        </div>

        <div className="field-group">
          <label>Passing Year</label>
          <input
            type="number"
            value={tenthYear}
            onChange={(e) => setTenthYear(e.target.value)}
            placeholder="e.g. 2020"
          />
        </div>

        <div className="field-group">
          <label>Percentage / CGPA</label>
          <input
            type="text"
            value={tenthPercentage}
            onChange={(e) => setTenthPercentage(e.target.value)}
            placeholder="e.g. 92% or 9.2"
          />
        </div>

      </div>
    </div>

    {/* PUC / 12th */}
    <div className="profile-card">

      <div className="card-heading">
        <div>
          <h3>PUC / 12th</h3>
          <p>Enter your pre-university details.</p>
        </div>
        <span className="card-icon">📚</span>
      </div>

      <div className="profile-fields">

        <div className="field-group">
          <label>College Name</label>
          <input
            type="text"
            value={pucCollege}
            onChange={(e) => setPucCollege(e.target.value)}
            placeholder="Enter college name"
          />
        </div>

        <div className="field-group">
          <label>Board</label>
          <input
            type="text"
            value={pucBoard}
            onChange={(e) => setPucBoard(e.target.value)}
            placeholder="e.g. Karnataka PUC"
          />
        </div>

        <div className="field-group">
          <label>Passing Year</label>
          <input
            type="number"
            value={pucYear}
            onChange={(e) => setPucYear(e.target.value)}
            placeholder="e.g. 2022"
          />
        </div>

        <div className="field-group">
          <label>Percentage</label>
          <input
            type="text"
            value={pucPercentage}
            onChange={(e) => setPucPercentage(e.target.value)}
            placeholder="e.g. 85%"
          />
        </div>

      </div>
    </div>

    {/* UG */}
    <div className="profile-card">

      <div className="card-heading">
        <div>
          <h3>UG / Undergraduate</h3>
          <p>Enter your undergraduate details.</p>
        </div>
        <span className="card-icon">🎓</span>
      </div>

      <div className="profile-fields">

        <div className="field-group">
          <label>Degree</label>
          <input
            type="text"
            value={ugDegree}
            onChange={(e) => setUgDegree(e.target.value)}
            placeholder="e.g. B.E / B.Tech / BCA"
          />
        </div>

        <div className="field-group">
          <label>University / College</label>
          <input
            type="text"
            value={ugUniversity}
            onChange={(e) => setUgUniversity(e.target.value)}
            placeholder="Enter university or college"
          />
        </div>

        <div className="field-group">
          <label>Specialization</label>
          <input
            type="text"
            value={ugSpecialization}
            onChange={(e) => setUgSpecialization(e.target.value)}
            placeholder="e.g. Computer Science"
          />
        </div>

        <div className="field-group">
          <label>Passing Year</label>
          <input
            type="number"
            value={ugYear}
            onChange={(e) => setUgYear(e.target.value)}
            placeholder="e.g. 2026"
          />
        </div>

        <div className="field-group">
          <label>CGPA / Percentage</label>
          <input
            type="text"
            value={ugCgpa}
            onChange={(e) => setUgCgpa(e.target.value)}
            placeholder="e.g. 8.5"
          />
        </div>

      </div>
    </div>

    {/* PG */}
    <div className="profile-card">

      <div className="card-heading">
        <div>
          <h3>PG / Postgraduate</h3>
          <p>Optional postgraduate details.</p>
        </div>
        <span className="card-icon">🎓</span>
      </div>

      <div className="profile-fields">

        <div className="field-group">
          <label>Degree</label>
          <input
            type="text"
            value={pgDegree}
            onChange={(e) => setPgDegree(e.target.value)}
            placeholder="e.g. M.Tech / MCA / MBA"
          />
        </div>

        <div className="field-group">
          <label>University / College</label>
          <input
            type="text"
            value={pgUniversity}
            onChange={(e) => setPgUniversity(e.target.value)}
            placeholder="Enter university or college"
          />
        </div>

        <div className="field-group">
          <label>Specialization</label>
          <input
            type="text"
            value={pgSpecialization}
            onChange={(e) => setPgSpecialization(e.target.value)}
            placeholder="Enter specialization"
          />
        </div>

        <div className="field-group">
          <label>Passing Year</label>
          <input
            type="number"
            value={pgYear}
            onChange={(e) => setPgYear(e.target.value)}
            placeholder="e.g. 2028"
          />
        </div>

        <div className="field-group">
          <label>CGPA / Percentage</label>
          <input
            type="text"
            value={pgCgpa}
            onChange={(e) => setPgCgpa(e.target.value)}
            placeholder="e.g. 8.5"
          />
        </div>

      </div>
    </div>

    <button
  className="save-btn"
  onClick={async () => {
    if (
      !tenthSchool.trim() ||
      !tenthBoard.trim() ||
      !tenthYear.trim() ||
      !tenthPercentage.trim() ||
      !pucCollege.trim() ||
      !pucBoard.trim() ||
      !pucYear.trim() ||
      !pucPercentage.trim() ||
      !ugDegree.trim() ||
      !ugUniversity.trim() ||
      !ugSpecialization.trim() ||
      !ugYear.trim() ||
      !ugCgpa.trim()
    ) {
      alert("❌ Please fill in all required academic details.");
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
            tenthSchool,
            tenthBoard,
            tenthYear,
            tenthPercentage,

            pucCollege,
            pucBoard,
            pucYear,
            pucPercentage,

            ugDegree,
            ugUniversity,
            ugSpecialization,
            ugYear,
            ugCgpa,

            pgDegree,
            pgUniversity,
            pgSpecialization,
            pgYear,
            pgCgpa,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("✅ Academic details saved successfully.");
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Server error. Please try again.");
    }
  }}
>
  Save Academic Details
</button>
    

  </section>
)}

          {/* =====================================================
              AREAS OF INTEREST
          ===================================================== */}
{activePage === "interest" && (
  <section className="dashboard-section">

    <h2 className="section-title">
      Areas of Interest
    </h2>

    <div className="profile-card">

      <div className="card-heading">
        <div>
          <h3>Career Preferences</h3>
          <p>Tell us what kind of opportunities you are looking for.</p>
        </div>

        <span className="card-icon">💡</span>
      </div>

      <div className="profile-fields">

        <div className="field-group">
          <label>Preferred Job Role</label>
          <input
            type="text"
            value={preferredRole}
            onChange={(e) => setPreferredRole(e.target.value)}
            placeholder="e.g. Software Developer"
          />
        </div>

        <div className="field-group">
          <label>Preferred Work Location</label>
          <input
            type="text"
            value={preferredLocation}
            onChange={(e) => setPreferredLocation(e.target.value)}
            placeholder="e.g. Bengaluru"
          />
        </div>

        <div className="field-group">
          <label>Work Preference</label>
          <select
            value={workPreference}
            onChange={(e) => setWorkPreference(e.target.value)}
          >
            <option value="">Select preference</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

      </div>

    </div>

    <div className="skills-card">

      <div className="card-heading">
        <div>
          <h3>Areas of Interest</h3>
          <p>Add the fields you are interested in.</p>
        </div>

        <span className="card-icon">🎯</span>
      </div>

      <div className="skill-input-row">

        <input
          type="text"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          placeholder="e.g. Web Development"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addInterest();
            }
          }}
        />

        <button
          className="add-btn"
          onClick={addInterest}
        >
          Add
        </button>

      </div>

      <div className="skills-list">

        {interests.length === 0 ? (

          <span className="no-skills">
            No areas of interest added yet.
          </span>

        ) : (

          interests.map((interest) => (
            <span
              className="skill-tag"
              key={interest}
            >
              {interest}

              <button
                onClick={() => deleteInterest(interest)}
              >
                ×
              </button>
            </span>
          ))

        )}

      </div>

    </div>

    <button
      className="save-btn"
      onClick={async () => {

        if (
          !preferredRole.trim() ||
          !preferredLocation.trim() ||
          !workPreference ||
          interests.length === 0
        ) {
          alert(
            "❌ Please complete your career preferences and add at least one area of interest."
          );
          return;
        }

        try {
          const response = await fetch(
            `https://careernexus-backend-2026.onrender.com/student/update/${student.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                preferredRole,
                preferredLocation,
                workPreference,
                interests,
              }),
            }
          );

          const data = await response.json();

          if (data.success) {
            alert("✅ Career preferences saved successfully.");
          } else {
            alert(`❌ ${data.message}`);
          }

        } catch (error) {
          console.error(error);
          alert("❌ Server error. Please try again.");
        }
      }}
    >
      Save Career Preferences
    </button>

  </section>
)}
          

          {/* =====================================================
              JOBS
          ===================================================== */}

          {activePage === "jobs" && (
            <section className="dashboard-section">

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
<h3>{job.jobTitle}</h3>
{/* Smart Job Matching */}
{(() => {
  const match = getJobMatch(job);

  return (
    <div className="job-match">
      <h4>🎯 Smart Job Match</h4>

      <div className="match-progress">
        <div
          className="match-progress-fill"
          style={{ width: `${match.matchPercentage}%` }}
        />
      </div>

      <p className="match-percentage">
        {match.matchPercentage}% Skills Match
      </p>

      <div className="matched-skills">
        <strong>✅ Matched Skills:</strong>
        <p>
          {match.matchedSkills.length
            ? match.matchedSkills.join(", ")
            : "No matching skills yet"}
        </p>
      </div>

      <div className="missing-skills">
        <strong>📚 Skills to Learn:</strong>
        <p>
          {match.missingSkills.length
            ? match.missingSkills.join(", ")
            : "You have all the required skills!"}
        </p>
      </div>
    </div>
  );
})()}
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
          )}


          {/* =====================================================
              APPLICATIONS
          ===================================================== */}

          {activePage === "applications" && (
            <section className="dashboard-section">

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
                      key={
                        application._id ||
                        application.jobId
                      }
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
                          .replace(/\s+/g, "-")}
                        `}
                      >
                        {application.status || "Applied"}
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </section>
          )}


          {/* =====================================================
              INTERVIEWS
          ===================================================== */}

          {activePage === "interviews" && (
            <section className="dashboard-section">

              <h2 className="section-title">
                Interviews
              </h2>

              <div className="interview-grid">

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


                <div className="upcoming-card">

                  <div className="card-heading">

                    <div>
                      <h3>Upcoming Interviews</h3>
                      <p>
                        Your scheduled placement interviews.
                      </p>
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
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                }
                              )}
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
          )}


          {/* =====================================================
              DOCUMENTS
          ===================================================== */}

          {activePage === "documents" && (
            <section className="dashboard-section">

              <h2 className="section-title">
                Documents
              </h2>

              <div className="documents-grid">

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

                    {resume
                      ? "Change Resume"
                      : "Upload Resume"}

                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                    />

                  </label>

                </div>


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
          )}


          {/* =====================================================
              FOOTER
          ===================================================== */}

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