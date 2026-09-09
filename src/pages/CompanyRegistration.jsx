import React, { useState } from "react";
import "./CompanyRegistration.css";
function CompanyRegister({ goToLogin }) {
  const [companyName, setCompanyName] = useState("");
  const [hrName, setHrName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");

  const registerCompany = async () => {

  if (
    !companyName ||
    !hrName ||
    !email ||
    !password ||
    !website ||
    !location
  ) {
    alert("❌ Please fill all fields.");
    return;
  }

  try {

    const response = await fetch("https://careernexus-backend-2026.onrender.com/company/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName,
        hrName,
        email,
        password,
        website,
        location,
      }),
    });

    const data = await response.json();

    if (data.success) {

      alert("🎉 Company Registered Successfully!");

      // Clear form
      setCompanyName("");
      setHrName("");
      setEmail("");
      setPassword("");
      setWebsite("");
      setLocation("");

    } else {

      alert(data.message);

    }

  } catch (error) {

    console.error(error);
    alert("❌ Server Connection Failed.");

  }

};

  return (
    <div className="company-register">

      <div className="register-card">

<h1>Create Company Account</h1>

<p className="subtitle">
  Register your organization and start hiring top talent.
</p>
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
          type="email"
          placeholder="Company Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Company Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <input
          type="text"
          placeholder="Company Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button onClick={registerCompany}>
          Register Company
        </button>
        <p
  style={{
    marginTop: "20px",
    textAlign: "center",
    color: "blue",
    cursor: "pointer",
    fontWeight: "bold",
  }}
  onClick={goToLogin}
>
  ← Back to Login
</p>

      </div>

    </div>
  );
}

export default CompanyRegister;