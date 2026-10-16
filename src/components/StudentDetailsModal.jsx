import React from "react";
import "./StudentDetailsModal.css";

function StudentDetailsModal({ applicant, onClose }) {
  if (!applicant) return null;

  const interests = applicant.interests || [];
  const skills = applicant.skills || [];

  return (
    <div className="student-modal-overlay">
      <div className="student-details-modal">

        {/* Header */}
        <div className="student-modal-header">
          <div>
            <div className="student-back-title">
              <button onClick={onClose} className="back-btn">
                ←
              </button>

              <div>
                <h2>Student Details</h2>
                <p>View complete student information</p>
              </div>
            </div>
          </div>

          <button className="close-modal-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Student Profile */}
        <div className="student-profile-card">

          <div className="student-avatar">
            {applicant.firstName
              ? applicant.firstName.charAt(0).toUpperCase()
              : applicant.studentName?.charAt(0).toUpperCase() || "S"}
          </div>

          <div className="student-profile-info">
            <h1>
              {applicant.firstName && applicant.lastName
                ? `${applicant.firstName} ${applicant.lastName}`
                : applicant.studentName}
            </h1>

            <p>✉ {applicant.studentEmail}</p>

            <div className="profile-badges">
              <span className="badge student-badge">
                Student
              </span>

              <span className="badge application-badge">
                Applied for: {applicant.jobTitle}
              </span>
            </div>
          </div>

          <div className="application-status">
            <span>Application Status</span>

            <strong className={
              applicant.status === "Shortlisted"
                ? "status-shortlisted"
                : applicant.status === "Rejected"
                ? "status-rejected"
                : "status-applied"
            }>
              {applicant.status || "Applied"}
            </strong>
          </div>

        </div>

        {/* Main Grid */}
        <div className="student-details-grid">

          {/* Personal Details */}
          <section className="details-card personal-card">
            <div className="card-title">
              <span className="card-icon">👤</span>
              <h3>Personal Details</h3>
            </div>

            <div className="details-list">

              <Detail label="Full Name" value={
                applicant.studentName
              } />

              <Detail label="Email" value={
                applicant.studentEmail
              } />

              <Detail label="Phone" value={
                applicant.phone
              } />

              <Detail label="Gender" value={
                applicant.gender
              } />

              <Detail label="Date of Birth" value={
                applicant.dateOfBirth
              } />

              <Detail label="Address" value={
                applicant.address
              } />

              <Detail label="City" value={
                applicant.city
              } />

              <Detail label="State" value={
                applicant.state
              } />

              <Detail label="PIN Code" value={
                applicant.pinCode
              } />

            </div>
          </section>


          {/* Academic Details */}
          <section className="details-card academic-card">
            <div className="card-title">
              <span className="card-icon">🎓</span>
              <h3>Academic Details</h3>
            </div>

            <div className="academic-columns">

              <div>
                <h4>10th</h4>

                <Detail
                  label="School"
                  value={applicant.tenthSchool}
                />

                <Detail
                  label="Board"
                  value={applicant.tenthBoard}
                />

                <Detail
                  label="Year"
                  value={applicant.tenthYear}
                />

                <Detail
                  label="Percentage"
                  value={applicant.tenthPercentage}
                />
              </div>


              <div>
                <h4>PUC / 12th</h4>

                <Detail
                  label="College"
                  value={applicant.pucCollege}
                />

                <Detail
                  label="Board"
                  value={applicant.pucBoard}
                />

                <Detail
                  label="Year"
                  value={applicant.pucYear}
                />

                <Detail
                  label="Percentage"
                  value={applicant.pucPercentage}
                />
              </div>


              <div>
                <h4>UG Degree</h4>

                <Detail
                  label="Degree"
                  value={applicant.ugDegree}
                />

                <Detail
                  label="University"
                  value={applicant.ugUniversity}
                />

                <Detail
                  label="Specialization"
                  value={applicant.ugSpecialization}
                />

                <Detail
                  label="Year"
                  value={applicant.ugYear}
                />

                <Detail
                  label="CGPA"
                  value={applicant.ugCgpa}
                />
              </div>


              <div>
                <h4>PG Degree</h4>

                <Detail
                  label="Degree"
                  value={applicant.pgDegree}
                />

                <Detail
                  label="University"
                  value={applicant.pgUniversity}
                />

                <Detail
                  label="Specialization"
                  value={applicant.pgSpecialization}
                />

                <Detail
                  label="Year"
                  value={applicant.pgYear}
                />

                <Detail
                  label="CGPA"
                  value={applicant.pgCgpa}
                />
              </div>

            </div>
          </section>


          {/* Areas of Interest */}
          <section className="details-card">
            <div className="card-title">
              <span className="card-icon">🎯</span>
              <h3>Areas of Interest</h3>
            </div>

            <div className="tag-container">

              {interests.length > 0 ? (
                interests.map((interest, index) => (
                  <span
                    className="interest-tag"
                    key={index}
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="empty-text">
                  No interests provided
                </span>
              )}

            </div>

            <div className="preference-list">

              <Detail
                label="Preferred Role"
                value={applicant.preferredRole}
              />

              <Detail
                label="Preferred Location"
                value={applicant.preferredLocation}
              />

              <Detail
                label="Work Preference"
                value={applicant.workPreference}
              />

            </div>
          </section>


          {/* Skills */}
          <section className="details-card">
            <div className="card-title">
              <span className="card-icon">💻</span>
              <h3>Skills & Links</h3>
            </div>

            <h4 className="section-label">
              Technical Skills
            </h4>

            <div className="tag-container">

              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    className="skill-tag"
                    key={index}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="empty-text">
                  No skills provided
                </span>
              )}

            </div>

            <div className="links-section">

              <div className="profile-link">
                <span>🔗</span>

                <div>
                  <small>LinkedIn</small>
                  <p>
                    {applicant.linkedin || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="profile-link">
                <span>🔗</span>

                <div>
                  <small>GitHub</small>
                  <p>
                    {applicant.github || "Not provided"}
                  </p>
                </div>
              </div>

            </div>
          </section>


          {/* Documents */}
          <section className="details-card documents-card">
            <div className="card-title">
              <span className="card-icon">📄</span>
              <h3>Documents</h3>
            </div>

            <DocumentRow
              title="Profile Picture"
              available={!!applicant.profilePicture}
            />

            <DocumentRow
              title="Resume"
              available={!!applicant.resume}
            />

            <DocumentRow
              title="Certificate"
              available={!!applicant.certificate}
            />

          </section>

        </div>

        {/* Footer */}
        <div className="student-modal-footer">
          <span>
            🔒 Student information is read-only
          </span>

          <button
            className="footer-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}


/* Reusable detail row */
function Detail({ label, value }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>
        {value || "Not provided"}
      </strong>
    </div>
  );
}


/* Document row */
function DocumentRow({ title, available }) {
  return (
    <div className="document-row">

      <div className="document-info">
        <span className="document-icon">
          📄
        </span>

        <span>{title}</span>
      </div>

      {available ? (
        <button className="view-document-btn">
          👁 View
        </button>
      ) : (
        <span className="not-available">
          Not available
        </span>
      )}

    </div>
  );
}

export default StudentDetailsModal;