const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
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

// Save Student Details
// Update Student Details
router.put("/update/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        department: req.body.department,
        year: req.body.year,
        cgpa: req.body.cgpa,
        linkedin: req.body.linkedin,
        github: req.body.github,
        skills: req.body.skills,
        interviews: req.body.interviews,
      },
      { new: true, runValidators: true }
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