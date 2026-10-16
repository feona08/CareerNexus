const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Student = require("../models/Student");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  cb(null, path.join(__dirname, "../uploads/resumes"));
},

  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.originalname}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
// ==========================
// Student Registration
// ==========================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      year,
      cgpa,
    } = req.body;

    // Check if email already exists
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // Create new student
    const student = new Student({
      name,
      email,
      password,
      department,
      year,
      cgpa,
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: "Student Registered Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});
// Upload Resume
router.post("/upload-resume/:id", upload.single("resume"), async (req, res) => {
  try {
    console.log("UPLOAD FILE:", req.file);
console.log("STUDENT ID:", req.params.id);
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a resume.",
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        resume: `/uploads/${req.file.filename}`,
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Resume uploaded successfully.",
      resume: student.resume,
    });

  } catch (error) {
    console.error("Resume upload error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Save / Update Student Details
router.put("/update/:id", async (req, res) => {
  try {
    console.log("Updating student ID:", req.params.id);
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        // Existing Student Details
        department: req.body.department,
        year: req.body.year,
        cgpa: req.body.cgpa,
        linkedin: req.body.linkedin,
        github: req.body.github,
        skills: req.body.skills,
        interviews: req.body.interviews,

        // Personal Details
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pinCode: req.body.pinCode,

        // Academic Details
        tenthSchool: req.body.tenthSchool,
        tenthBoard: req.body.tenthBoard,
        tenthYear: req.body.tenthYear,
        tenthPercentage: req.body.tenthPercentage,

        pucCollege: req.body.pucCollege,
        pucBoard: req.body.pucBoard,
        pucYear: req.body.pucYear,
        pucPercentage: req.body.pucPercentage,

        ugDegree: req.body.ugDegree,
        ugUniversity: req.body.ugUniversity,
        ugSpecialization: req.body.ugSpecialization,
        ugYear: req.body.ugYear,
        ugCgpa: req.body.ugCgpa,

        pgDegree: req.body.pgDegree,
        pgUniversity: req.body.pgUniversity,
        pgSpecialization: req.body.pgSpecialization,
        pgYear: req.body.pgYear,
        pgCgpa: req.body.pgCgpa,

        // Areas of Interest / Career Preferences
        preferredRole: req.body.preferredRole,
        preferredLocation: req.body.preferredLocation,
        workPreference: req.body.workPreference,
        interests: req.body.interests,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student Details Updated Successfully",
      student,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;