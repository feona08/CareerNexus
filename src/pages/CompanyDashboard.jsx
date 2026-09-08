import React, { useState, useEffect } from "react";import "./CompanyDashboard.css";

function CompanyDashboard({ logout }) {
  // Company Profile
  const [companyName, setCompanyName] = useState("");
  const [hrName, setHrName] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");

  // Dashboard Statistics
  const [selectedStudents] = useState(0);

  // Job Form
  const [jobTitle, setJobTitle] = useState("");
  const [packageOffered, setPackageOffered] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [skills, setSkills] = useState("");
  const [deadline, setDeadline] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  // Posted Jobs
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const applications = applicants.length;
  useEffect(() => {
  fetch("http://localhost:5000/job/all")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setJobs(data.jobs);
      }
    })
    .catch((error) => {
      console.error("Error loading jobs:", error);
    });
}, []);
useEffect(() => {
  fetch("http://localhost:5000/application/all")
    .then((response) => response.json())
    .then((data) => {
      console.log("APPLICATION DATA:", data);

      if (data.success) {
        setApplicants(data.applications);
      }
    })
    .catch((error) => {
      console.error("Error loading applicants:", error);
    });
}, []);
  const jobsPosted = jobs.length;

  const postJob = async () => {
  if (
    !companyName ||
    !jobTitle ||
    !packageOffered ||
    !jobLocation ||
    !cgpa ||
    !skills ||
    !deadline ||
    !experience ||
    !description
  ) {
    alert("❌ Please fill all job details.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/job/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName,
        jobTitle,
        package: packageOffered,
        location: jobLocation,
        skills,
        experience,
        lastDate: deadline,
        description,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("✅ Job Posted Successfully!");

      setJobTitle("");
      setPackageOffered("");
      setJobLocation("");
      setCgpa("");
      setSkills("");
      setDeadline("");
      setExperience("");
      setDescription("");

      setJobs([...jobs, data.job]);
    } else {
      alert("❌ " + data.message);
    }

  } catch (error) {
    console.error(error);
    alert("❌ Server Connection Failed.");
  }
};
  const deleteJob = (index) => {
    const updatedJobs = jobs.filter((_, i) => i !== index);
    setJobs(updatedJobs);
  };
  const updateApplicationStatus = async (id, status) => {
  try {
    const response = await fetch(
      `http://localhost:5000/application/status/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert(`✅ Application ${status}`);

      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) =>
          applicant._id === id
            ? { ...applicant, status: status }
            : applicant
        )
      );
    } else {
      alert("❌ " + data.message);
    }
  } catch (error) {
    console.error("Status update error:", error);
    alert("❌ Server connection failed.");
  }
};

  return (
    <div className="company-dashboard">

      <h1>🏢 Company Dashboard</h1>

      {/* Statistics */}

      <div className="stats-container">

        <div className="stat-card">
          <h2>{jobsPosted}</h2>
          <p>Jobs Posted</p>
        </div>

        <div className="stat-card">
          <h2>{applications}</h2>
          <p>Applications</p>
        </div>

        <div className="stat-card">
          <h2>{selectedStudents}</h2>
          <p>Selected Students</p>
        </div>

      </div>

      {/* Company Profile */}

      <div className="card">

        <h2>🏢 Company Profile</h2>

        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <input
          type="text"
          placeholder="HR Name"
          value={hrName}
          onChange={(e) => setHrName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

      </div>

      {/* Post Job */}

      <div className="card">

        <h2>💼 Post New Job</h2>

        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Package (LPA)"
          value={packageOffered}
          onChange={(e) => setPackageOffered(e.target.value)}
        />

        <input
          type="text"
          placeholder="Job Location"
          value={jobLocation}
          onChange={(e) => setJobLocation(e.target.value)}
        />

        <input
          type="number"
          placeholder="Minimum CGPA"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
        />
        <input
  type="text"
  placeholder="Experience Required"
  value={experience}
  onChange={(e) => setExperience(e.target.value)}
/>
<textarea
  placeholder="Job Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

        <input
          type="text"
          placeholder="Required Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button onClick={postJob}>
          Post Job
        </button>

      </div>

      {/* Posted Jobs */}

      <div className="card">

        <h2>📋 Posted Jobs</h2>

        {jobs.length === 0 ? (
          <p>No Jobs Posted Yet.</p>
        ) : (
          jobs.map((job, index) => (
            <div className="job-card" key={index}>

              <h3>{job.jobTitle}</h3>

              <p><b>💰 Package:</b> {job.package} LPA</p>
<p><b>📍 Location:</b> {job.location}</p>
<p><b>🎯 Experience:</b> {job.experience}</p>
<p><b>🛠️ Skills:</b> {job.skills}</p>
<p><b>📅 Deadline:</b> {job.lastDate}</p>
<p><b>📝 Description:</b> {job.description}</p>

              <button
                className="delete-btn"
                onClick={() => deleteJob(index)}
              >
                Delete Job
              </button>

            </div>
          ))
        )}

      </div>

      {/* Applicants */}

      <div className="card">


  <h2>👨‍🎓 Applicants</h2>

  {applicants.length === 0 ? (
    <p>No applications received yet.</p>
  ) : (
    applicants.map((applicant) => (
      <div className="job-card" key={applicant._id}>

        <h3>{applicant.jobTitle}</h3>

        <p>
          <b>👤 Student:</b> {applicant.studentName}
        </p>

        <p>
          <b>📧 Email:</b> {applicant.studentEmail}
        </p>

        <p>
          <b>🏢 Company:</b> {applicant.companyName}
        </p>

        <p>
          <b>📌 Status:</b> {applicant.status || "Applied"}
        </p>

        <div className="applicant-buttons">

          <button
            onClick={() =>
              updateApplicationStatus(
                applicant._id,
                "Shortlisted"
              )
            }
          >
            ✅ Shortlist
          </button>

          <button
            onClick={() =>
              updateApplicationStatus(
                applicant._id,
                "Rejected"
              )
            }
          >
            ❌ Reject
          </button>

        </div>

      </div>
    ))
  )}

</div>
  

      {/* Logout */}

      <div className="logout-section">

        <button
          className="logout-btn"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
}

export default CompanyDashboard;