const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const placementOfficerRoutes = require("./routes/PlacementOfficerRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/student", studentRoutes);
app.use("/company", companyRoutes);
app.use("/admin", adminRoutes);
app.use("/job",jobRoutes);
app.use("/application", applicationRoutes);
app.use("/placement-officer", placementOfficerRoutes);
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

  const normalizedEmail = email.trim().toLowerCase();

  console.log("LOGIN EMAIL RECEIVED:", normalizedEmail);
  console.log("DATABASE:", mongoose.connection.name);
  console.log("COLLECTION:", Student.collection.name);

  // Check registered students
  const allStudents = await Student.find({}, { email: 1 });

  console.log("TOTAL STUDENTS:", allStudents.length);

  allStudents.forEach((s) => {
    console.log("SAVED EMAIL:", s.email);
  });

  // Find student
  const student = await Student.findOne({
    email: normalizedEmail,
  });

  console.log(
    "STUDENT FOUND:",
    student ? student.email : "NO STUDENT FOUND"
  );

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

   // Placement Officer Login
if (
  role === "placementOfficer" &&
  email === "officer@careernexus.com" &&
  password === "officer123"
) {
  return res.json({
    success: true,
    role: "placementOfficer",
    message: "Placement Officer Login Successful",
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});