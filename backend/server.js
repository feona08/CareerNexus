const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/student", studentRoutes);
app.use("/company", companyRoutes);
app.use("/admin", adminRoutes);
app.use("/job",jobRoutes);
app.use("/application", applicationRoutes);
app.use("/job", jobRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed");
    console.log(err);
  });
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Student Login
    if (role === "student") {
      const Student = require("./models/Student");

      const student = await Student.findOne({ email });

      if (!student) {
        return res.status(401).json({
          success: false,
          message: "Student not found",
        });
      }

      if (student.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password",
        });
      }

      return res.json({
        success: true,
        role: "student",
        message: "Student Login Successful",
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          department: student.department,
          year: student.year,
          cgpa: student.cgpa,
          linkedin: student.linkedin,
          github: student.github,
          skills: student.skills,
        },
      });
    }

    // Company Login
    if (role === "company") {
      const Company = require("./models/Company");

      const company = await Company.findOne({ email });

      if (!company) {
        return res.status(401).json({
          success: false,
          message: "Company not found",
        });
      }

      if (company.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password",
        });
      }

      return res.json({
        success: true,
        role: "company",
        message: "Company Login Successful",
      });
    }

    // Admin Login
    if (
      role === "admin" &&
      email === "admin@careernexus.com" &&
      password === "admin123"
    ) {
      return res.json({
        success: true,
        role: "admin",
        message: "Admin Login Successful",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});