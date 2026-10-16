import { useEffect, useMemo, useState } from "react";
import "./PlacementOfficerDashboard.css";

const API_URL = "https://careernexus-backend-2026.onrender.com";

function normalizeSkills(skills) {
if (Array.isArray(skills)) {
return skills
.filter((skill) => typeof skill === "string")
.map((skill) => skill.trim().toLowerCase())
.filter(Boolean);
}

if (typeof skills === "string") {
return skills
.split(",")
.map((skill) => skill.trim().toLowerCase())
.filter(Boolean);
}

return [];
}

function getJobSkills(job) {
if (!job) return [];

return normalizeSkills(
job.requiredSkills || job.skillsRequired || job.skills || []
);
}

function calculateReadiness(student) {
let score = 0;

if (
typeof student.resume === "string" &&
student.resume.trim()
) {
score += 25;
}

if (normalizeSkills(student.skills).length > 0) {
score += 25;
}

if (
student.cgpa !== undefined &&
student.cgpa !== null &&
student.cgpa !== "" &&
Number.isFinite(Number(student.cgpa))
) {
score += 20;
}

if (student.email && student.phone) {
score += 15;
}

if (student.preferredRole) {
score += 15;
}

return score;
}

function PlacementOfficerDashboard({ logout }) {
const [students, setStudents] = useState([]);
const [companies, setCompanies] = useState([]);
const [jobs, setJobs] = useState([]);
const [applications, setApplications] = useState([]);

const [searchText, setSearchText] = useState("");
const [readinessFilter, setReadinessFilter] = useState("all");
const [selectedJob, setSelectedJob] = useState("all");
const [selectedResume, setSelectedResume] = useState(null);

const [announcementText, setAnnouncementText] = useState("");
const [announcements, setAnnouncements] = useState([]);

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const API_URL = "https://careernexus-backend-2026.onrender.com";

const loadDashboard = async () => {
try {
setLoading(true);
setError("");


const response = await fetch(
  `${API_URL}/placement-officer/dashboard`
);

const data = await response.json();

if (!response.ok || !data.success) {
  throw new Error(
    data.message || "Failed to load dashboard"
  );
}

setStudents(data.students || []);
setCompanies(data.companies || []);
setJobs(data.jobs || []);
setApplications(data.applications || []);

} catch (err) {
console.error("Dashboard error:", err);
setError(err.message || "Failed to fetch dashboard data");
} finally {
setLoading(false);
}
};


useEffect(() => {
let active = true;


async function loadDashboard() {
  try {
    setLoading(true);
    setError("");

    const response = await fetch(
      `${API_URL}/placement-officer/dashboard`,
      { credentials: "include" }
    );

    if (!response.ok) {
      throw new Error(
        `Dashboard API returned status ${response.status}.`
      );
    }

    const data = await response.json();

    if (data.success !== true) {
      throw new Error(
        data.message || "Could not load dashboard data."
      );
    }

    if (!active) return;

    setStudents(Array.isArray(data.students) ? data.students : []);
    setCompanies(Array.isArray(data.companies) ? data.companies : []);
    setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    setApplications(
      Array.isArray(data.applications) ? data.applications : []
    );
  } catch (err) {
    if (active) {
      console.error("Placement Officer dashboard:", err);
      setError(err.message || "Unable to load dashboard.");
    }
  } finally {
    if (active) setLoading(false);
  }
}

loadDashboard();

return () => {
  active = false;
};


}, []);

const readyStudents = useMemo(
() => students.filter((student) => calculateReadiness(student) >= 75),
[students]
);

const uploadedResumes = useMemo(
() =>
students.filter(
(student) =>
typeof student.resume === "string" &&
student.resume.trim().length > 0
),
[students]
);

const selectedJobData =
selectedJob === "all"
? null
: jobs.find((job) => job._id === selectedJob) || null;

const filteredStudents = students.filter((student) => {
const search = searchText.trim().toLowerCase();


const matchesSearch = [
  student.name,
  student.email,
  student.department,
].some((value) =>
  String(value || "").toLowerCase().includes(search)
);

const score = calculateReadiness(student);

const matchesReadiness =
  readinessFilter === "all" ||
  (readinessFilter === "ready" && score >= 75) ||
  (readinessFilter === "training" && score >= 40 && score < 75) ||
  (readinessFilter === "incomplete" && score < 40);

const requiredSkills = getJobSkills(selectedJobData);
const studentSkills = normalizeSkills(student.skills);

const skillMatch =
  requiredSkills.length === 0 ||
  requiredSkills.some((skill) => studentSkills.includes(skill));

return matchesSearch && matchesReadiness && skillMatch;


});

function getMissingSkills(student, job) {
const studentSkills = normalizeSkills(student.skills);
const requiredSkills = getJobSkills(job);


return requiredSkills.filter(
  (skill) => !studentSkills.includes(skill)
);


}

function viewResume(student) {
if (!student.resume) {
alert("This student has not uploaded a resume.");
return;
}


setSelectedResume(student);


}

function publishAnnouncement() {
if (!announcementText.trim()) {
alert("Please enter an announcement.");
return;
}


setAnnouncements((previous) => [
  {
    id: `${Date.now()}`,
    text: announcementText.trim(),
    date: new Date().toLocaleString(),
  },
  ...previous,
]);

setAnnouncementText("");


}

function exportStudents() {
const headers = [
"Name",
"Email",
"Department",
"Year",
"CGPA",
"Skills",
"Readiness Score",
"Resume Uploaded",
];


const rows = filteredStudents.map((student) => [
  student.name || "",
  student.email || "",
  student.department || "",
  student.year ?? "",
  student.cgpa ?? "",
  normalizeSkills(student.skills).join(", "),
  calculateReadiness(student),
  student.resume ? "Yes" : "No",
]);

const escapeCSV = (value) =>
  `"${String(value).replace(/"/g, '""')}"`;

const csv = [headers, ...rows]
  .map((row) => row.map(escapeCSV).join(","))
  .join("\r\n");

const blob = new Blob(["\uFEFF" + csv], {
  type: "text/csv;charset=utf-8;",
});

const url = URL.createObjectURL(blob);
const link = document.createElement("a");

link.href = url;
link.download = "CareerNexus_Student_Report.csv";
link.click();

URL.revokeObjectURL(url);


}

if (loading) {
return ( <div className="po-dashboard"> <div className="po-loading">Loading Placement Officer Dashboard...</div> </div>
);
}

return ( <main className="po-dashboard"> <header className="po-header"> <div> <h1>🎓 CareerNexus</h1> <p>Placement Officer Dashboard</p> </div>


    <button className="po-logout-btn" onClick={logout} type="button">
      Logout
    </button>
  </header>

  {error && (
    <section className="po-error">
      <h3>Unable to load dashboard data</h3>
      <p>{error}</p>
      <p>
        Check whether your backend implements
        {" "}/placement-officer/dashboard.
      </p>
    </section>
  )}

  <section className="po-stats">
    <article className="po-stat-card">
      <span>🎓</span>
      <h2>{students.length}</h2>
      <p>Total Students</p>
    </article>

    <article className="po-stat-card">
      <span>🏢</span>
      <h2>{companies.length}</h2>
      <p>Companies</p>
    </article>

    <article className="po-stat-card">
      <span>💼</span>
      <h2>{jobs.length}</h2>
      <p>Available Jobs</p>
    </article>

    <article className="po-stat-card">
      <span>📄</span>
      <h2>{applications.length}</h2>
      <p>Applications</p>
    </article>

    <article className="po-stat-card">
      <span>📑</span>
      <h2>{uploadedResumes.length}</h2>
      <p>Resumes Uploaded</p>
    </article>

    <article className="po-stat-card">
      <span>✅</span>
      <h2>{readyStudents.length}</h2>
      <p>Profile Ready</p>
    </article>
  </section>

  <section className="po-card">
    <div className="po-section-heading">
      <div>
        <h2>🔍 Student Readiness & Resume Viewer</h2>
        <p>Search profiles and review student preparation.</p>
      </div>

      <button
        type="button"
        className="po-primary-btn"
        onClick={exportStudents}
      >
        📥 Export CSV
      </button>
    </div>

    <input
      className="po-search"
      type="search"
      placeholder="Search by student name, email, or department..."
      value={searchText}
      onChange={(event) => setSearchText(event.target.value)}
    />

    <div className="po-filter-row">
      <select
        value={readinessFilter}
        onChange={(event) => setReadinessFilter(event.target.value)}
      >
        <option value="all">All Readiness Levels</option>
        <option value="ready">Ready: 75% and above</option>
        <option value="training">Needs Improvement: 40–74%</option>
        <option value="incomplete">Incomplete: below 40%</option>
      </select>

      <select
        value={selectedJob}
        onChange={(event) => setSelectedJob(event.target.value)}
      >
        <option value="all">Compare with all jobs</option>

        {jobs.map((job) => (
          <option key={job._id} value={job._id}>
            {job.title || job.jobTitle || "Untitled Job"}
          </option>
        ))}
      </select>
    </div>

    <div className="po-table-wrapper">
      <table className="po-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Department</th>
            <th>CGPA</th>
            <th>Skills</th>
            <th>Readiness</th>
            <th>Skill Gap</th>
            <th>Resume</th>
          </tr>
        </thead>

        <tbody>
          {filteredStudents.map((student) => {
            const readiness = calculateReadiness(student);
            const missingSkills = selectedJobData
              ? getMissingSkills(student, selectedJobData)
              : [];

            return (
              <tr key={student._id || student.email}>
                <td>
                  <strong>{student.name || "Unknown"}</strong>
                  <small>{student.email || "No email"}</small>
                </td>

                <td>{student.department || "N/A"}</td>
                <td>{student.cgpa ?? "N/A"}</td>

                <td>
                  {normalizeSkills(student.skills).join(", ") ||
                    "No skills added"}
                </td>

                <td>
                  <strong>{readiness}%</strong>
                  <div className="po-progress">
                    <div
                      className="po-progress-fill"
                      style={{ width: `${readiness}%` }}
                    />
                  </div>
                  <small>
                    {readiness >= 75
                      ? "Ready"
                      : readiness >= 40
                      ? "Needs improvement"
                      : "Incomplete"}
                  </small>
                </td>

                <td>
                  {!selectedJobData ? (
                    <span>Select a job</span>
                  ) : getJobSkills(selectedJobData).length === 0 ? (
                    <span>No required skills listed</span>
                  ) : missingSkills.length === 0 ? (
                    <span className="po-good">All skills matched</span>
                  ) : (
                    <span className="po-missing">
                      Missing: {missingSkills.join(", ")}
                    </span>
                  )}
                </td>

                <td>
                  <button
                    type="button"
                    className="po-view-btn"
                    disabled={!student.resume}
                    onClick={() => viewResume(student)}
                  >
                    {student.resume ? "View Resume" : "Not Uploaded"}
                  </button>
                </td>
              </tr>
            );
          })}

          {filteredStudents.length === 0 && (
            <tr>
              <td colSpan="7">
                {error
                  ? "Student data could not be loaded."
                  : "No matching students found."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <p className="po-note">
      The readiness score measures profile completeness, not guaranteed
      employability. Skill matching depends on the fields provided by
      your backend.
    </p>
  </section>

  <section className="po-card">
    <h2>⚠️ At-Risk Student Alerts</h2>
    <p>Students with profile information that may need attention.</p>

    {students.filter((student) =>
      !student.resume ||
      normalizeSkills(student.skills).length === 0 ||
      student.cgpa === undefined ||
      student.cgpa === null ||
      student.cgpa === ""
    ).length === 0 ? (
      <p className="po-good">No missing items found in these checks.</p>
    ) : (
      students
        .filter((student) =>
          !student.resume ||
          normalizeSkills(student.skills).length === 0 ||
          student.cgpa === undefined ||
          student.cgpa === null ||
          student.cgpa === ""
        )
        .map((student) => (
          <article className="po-alert-item" key={student._id}>
            <strong>{student.name || student.email || "Student"}</strong>
            <p>
              {!student.resume && "Resume missing. "}
              {normalizeSkills(student.skills).length === 0 &&
                "Skills missing. "}
              {(student.cgpa === undefined ||
                student.cgpa === null ||
                student.cgpa === "") &&
                "CGPA missing."}
            </p>
          </article>
        ))
    )}
  </section>

  <section className="po-card">
    <h2>🏢 Companies</h2>

    {companies.length === 0 ? (
      <p>No companies found.</p>
    ) : (
      companies.map((company) => (
        <article className="po-company-item" key={company._id}>
          <strong>{company.companyName || company.name || "Company"}</strong>
          <span>{company.email || "No email"}</span>
        </article>
      ))
    )}
  </section>

  <section className="po-card">
    <h2>📢 Placement Announcements</h2>
    <p>
      These announcements are temporary and will disappear after refreshing
      the page.
    </p>

    <textarea
      className="po-announcement-input"
      placeholder="Write an announcement for students..."
      value={announcementText}
      onChange={(event) => setAnnouncementText(event.target.value)}
    />

    <button
      type="button"
      className="po-primary-btn"
      onClick={publishAnnouncement}
    >
      Publish Announcement
    </button>

    <div className="po-announcements">
      {announcements.length === 0 ? (
        <p>No announcements published this session.</p>
      ) : (
        announcements.map((announcement) => (
          <article className="po-company-item" key={announcement.id}>
            <div>
              <strong>{announcement.text}</strong>
              <small>{announcement.date}</small>
            </div>
          </article>
        ))
      )}
    </div>
  </section>

  {selectedResume && (
    <div
      className="po-resume-overlay"
      onClick={() => setSelectedResume(null)}
    >
      <section
        className="po-resume-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="po-section-heading">
          <div>
            <h2>Student Resume</h2>
            <p>{selectedResume.name || selectedResume.email}</p>
          </div>

          <button
            type="button"
            className="po-logout-btn"
            onClick={() => setSelectedResume(null)}
          >
            Close
          </button>
        </div>

        {/^https?:\/\//i.test(selectedResume.resume) ? (
          <iframe
            title="Student resume"
            src={selectedResume.resume}
            className="po-resume-frame"
          />
        ) : (
          <p>
            The resume value is not a full web URL. Your backend must serve
            the uploaded file through an accessible URL before it can be
            displayed here.
          </p>
        )}
      </section>
    </div>
  )}
</main>


);
}

export default PlacementOfficerDashboard;
