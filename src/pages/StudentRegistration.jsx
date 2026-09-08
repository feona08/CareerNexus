import { useState } from "react";

function StudentRegistration({ goToLogin }) {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    year: "",
    cgpa: "",
  });

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const registerStudent = async () => {
    try {
      const response = await fetch("http://localhost:5000/student/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Registration Successful");
        goToLogin();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("❌ Server Connection Failed");
    }
  };

  return (
    <div className="container">
      <div className="login-card">

        <h1>🎓 Student Registration</h1>

        <input
          name="name"
          placeholder="Full Name"
          value={student.name}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={student.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={student.password}
          onChange={handleChange}
        />

        <input
          name="department"
          placeholder="Department"
          value={student.department}
          onChange={handleChange}
        />

        <input
          name="year"
          placeholder="Year"
          value={student.year}
          onChange={handleChange}
        />

        <input
          name="cgpa"
          placeholder="CGPA"
          value={student.cgpa}
          onChange={handleChange}
        />

        <button onClick={registerStudent}>
          Register
        </button>

        <button onClick={goToLogin}>
          Back to Login
        </button>

      </div>
    </div>
  );
}

export default StudentRegistration;