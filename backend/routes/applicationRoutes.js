const express = require("express");
const router = express.Router();

const Application = require("../models/Application");
const Student = require("../models/Student");

// ==========================
// APPLY FOR JOB
// ==========================

router.post("/apply", async (req, res) => {
  try {
    console.log("APPLY REQUEST:", req.body);
    const {
      studentName,
      studentEmail,
      jobId,
      jobTitle,
      companyName,
    } = req.body;

    if (
      !studentName ||
      !studentEmail ||
      !jobId ||
      !jobTitle ||
      !companyName
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing application details",
      });
    }

    // Check if student already applied
    const existingApplication = await Application.findOne({
      studentEmail,
      jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    // Find the student
    const student = await Student.findOne({
      email: studentEmail,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student details not found",
      });
    }

    // Create application with student information
    const application = new Application({
      studentName: student.name || studentName,
      studentEmail: student.email,

      jobId,
      jobTitle,
      companyName,

      // Personal Details
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      address: student.address,
      city: student.city,
      state: student.state,
      pinCode: student.pinCode,

      // Academic Details
      tenthSchool: student.tenthSchool,
      tenthBoard: student.tenthBoard,
      tenthYear: student.tenthYear,
      tenthPercentage: student.tenthPercentage,

      pucCollege: student.pucCollege,
      pucBoard: student.pucBoard,
      pucYear: student.pucYear,
      pucPercentage: student.pucPercentage,

      ugDegree: student.ugDegree,
      ugUniversity: student.ugUniversity,
      ugSpecialization: student.ugSpecialization,
      ugYear: student.ugYear,
      ugCgpa: student.ugCgpa,

      pgDegree: student.pgDegree,
      pgUniversity: student.pgUniversity,
      pgSpecialization: student.pgSpecialization,
      pgYear: student.pgYear,
      pgCgpa: student.pgCgpa,

      // Career Details
      preferredRole: student.preferredRole,
      preferredLocation: student.preferredLocation,
      workPreference: student.workPreference,
      interests: student.interests,

      // Existing career information
      department: student.department,
      year: student.year,
      cgpa: student.cgpa,
      linkedin: student.linkedin,
      github: student.github,
      skills: student.skills,

      // Resume / Certificate
      resume: student.resume,
      certificate: student.certificate,
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application,
    });

  } catch (error) {
    console.error("Application error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================
// GET ALL APPLICATIONS
// ==========================

router.get("/all", async (req, res) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      applications: applications,
    });

  } catch (error) {
    console.error("Fetching applications error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================
// UPDATE APPLICATION STATUS
// ==========================

router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      message: "Application status updated",
      application,
    });

  } catch (error) {
    console.error("Status update error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;