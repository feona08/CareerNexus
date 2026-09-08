const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
// Get admin dashboard statistics
router.get("/dashboard", async (req, res) => {
  try {
const studentCount = await Student.countDocuments();
const companyCount = await Company.countDocuments();
const jobCount = await Job.countDocuments();
const applicationCount = await Application.countDocuments();
const students = await Student.find().select("name email department year cgpa");
const companies = await Company.find().select(
      "companyName hrName email website location"
    );

    res.json({
      success: true,
      studentCount,
      companyCount,
      students,
      companies,
      jobCount,
      applicationCount,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;