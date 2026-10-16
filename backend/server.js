const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Student = require("./models/Student");
const Company = require("./models/Company");

const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const placementOfficerRoutes = require("./routes/PlacementOfficerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/student", studentRoutes);
app.use("/company", companyRoutes);
app.use("/admin", adminRoutes);
app.use("/job", jobRoutes);
app.use("/application", applicationRoutes);
app.use("/placement-officer", placementOfficerRoutes);
app.use("/notifications", notificationRoutes);

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please enter email, password, and role.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ==========================
    // Student Login
    // ==========================
    if (role === "student") {
      // Find student regardless of email capitalization or surrounding spaces
      const escapedEmail = normalizedEmail.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const student = await Student.findOne({
        email: {
          $regex: `^\\s*${escapedEmail}\\s*$`,
          $options: "i",
        },
      });

      if (!student) {
        return res.status(401).json({
          success: false,
          message:
            "Student not found. Please register first or check your email.",
        });
      }

      if (student.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password.",
        });
      }

      return res.status(200).json({
        success: true,
        role: "student",
        message: "Student Login Successful",

        student: {
          _id: student._id,
          id: student._id,
          name: student.name,
          email: student.email,
          department: student.department,
          year: student.year,
          cgpa: student.cgpa,
          linkedin: student.linkedin,
          github: student.github,
          skills: student.skills || [],
        },
      });
    }

    // ==========================
    // Company Login
    // ==========================
    if (role === "company") {
      const escapedEmail = normalizedEmail.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const company = await Company.findOne({
        email: {
          $regex: `^\\s*${escapedEmail}\\s*$`,
          $options: "i",
        },
      });

      if (!company) {
        return res.status(401).json({
          success: false,
          message: "Company not found. Please check your email.",
        });
      }

      if (company.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password.",
        });
      }

      return res.status(200).json({
        success: true,
        role: "company",
        message: "Company Login Successful",

        company: {
          _id: company._id,
          id: company._id,
          companyName: company.companyName,
          hrName: company.hrName,
          email: company.email,
          website: company.website,
          location: company.location,
        },
      });
    }

    // ==========================
    // Placement Officer Login
    // ==========================
    if (
      role === "placementOfficer" &&
      normalizedEmail === "officer@careernexus.com" &&
      password === "officer123"
    ) {
      return res.status(200).json({
        success: true,
        role: "placementOfficer",
        message: "Placement Officer Login Successful",
      });
    }

    // Invalid credentials
    return res.status(401).json({
      success: false,
      message: "Invalid credentials.",
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login. Please try again.",
    });
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    console.log("Database:", mongoose.connection.name);
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:", error.message);
  });

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});