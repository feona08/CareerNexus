import StudentRegistration from "./pages/StudentRegistration";
import { useState } from "react";
import "./App.css";
import CompanyRegister from "./pages/CompanyRegistration";
import StudentDashboard from "./pages/StudentDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import PlacementOfficerDashboard from "./pages/PlacementOfficerDashboard";

function App() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [loggedInRole, setLoggedInRole] = useState(null);
  const [loggedInStudent, setLoggedInStudent] = useState(null);
  const [loggedInCompany, setLoggedInCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState("login");

  const handleLogin = async () => {
    try {
      const response = await 
fetch("https://careernexus-backend-2026.onrender.com/login", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setPopupMessage(data.message);

        if (data.role === "student") {
  setLoggedInStudent(data.student);
}

if (data.role === "company") {
  setLoggedInCompany(data.company);
}

        setTimeout(() => {
          setLoggedInRole(data.role);
        }, 1000);
      } else {
        setPopupMessage(data.message);
      }
    } catch (error) {
      setPopupMessage("❌ Server connection failed.");
    }
  };

  // Student Registration
  if (currentPage === "studentRegister") {
    return (
      <StudentRegistration
        goToLogin={() => setCurrentPage("login")}
      />
    );
  }

  // Company Registration
  if (currentPage === "companyRegister") {
    return (
      <CompanyRegister
        goToLogin={() => setCurrentPage("login")}
      />
    );
  }

  // Student Dashboard
  if (loggedInRole === "student") {
    return (
      <StudentDashboard
        student={loggedInStudent}
        logout={() => {
          setLoggedInRole(null);
          setLoggedInStudent(null);
        }}
      />
    );
  }

  // Company Dashboard
  if (loggedInRole === "company") {
  return (
    <CompanyDashboard
      company={loggedInCompany}
      logout={() => setLoggedInRole(null)}
    />
  );
}

  // Placement Officer Dashboard
  if (loggedInRole === "placementOfficer") {
    return(
      <PlacementOfficerDashboard
        logout={() => setLoggedInRole(null)}
      />
    );
  }

  return (
    <div className="container">
      <div className="login-card">

        <h1>Career Nexus AI</h1>
        <p>Smart Placement & Career Ecosystem</p>

        <div className="role-buttons">

          <button
            className={role === "student" ? "active" : ""}
            onClick={() => setRole("student")}
          >
            🎓 Student
          </button>

          <button
            className={role === "company" ? "active" : ""}
            onClick={() => setRole("company")}
          >
            🏢 Company
          </button>

          <button
            className={role === "placementOfficer" ? "active" : ""}
            onClick={() => setRole("placementOfficer")}
          >
            👨‍💼 Placement Officer
          </button>

        </div>

        <input
          type="email"
          placeholder={`Enter ${role} email`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <div style={{ marginTop: "20px", textAlign: "center" }}>

          <p>
            New Student?{" "}
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => setCurrentPage("studentRegister")}
            >
              Register Here
            </span>
          </p>

          <p>
            New Company?{" "}
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => setCurrentPage("companyRegister")}
            >
              Register Here
            </span>
          </p>

        </div>

        <p className="forgot">Forgot Password?</p>

        {popupMessage && (
          <div className="popup">
            {popupMessage}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;

