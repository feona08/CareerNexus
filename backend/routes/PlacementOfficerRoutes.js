const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Company = require("../models/Company");

// Use the same Job model used by your existing job routes.
// If your model has a different filename, adjust this import.
const Job = require("../models/Job");

// Use the same Application model used by your existing application routes.
// If your model has a different filename, adjust this import.
const Application = require("../models/Application");

// GET Placement Officer Dashboard Data
router.get("/dashboard", async (req, res) => {
try {
// Fetch data from MongoDB
const students = await Student.find()
.select("-password")
.lean();


const companies = await Company.find()
  .select("-password")
  .lean();

const jobs = await Job.find().lean();

const applications = await Application.find().lean();

return res.status(200).json({
  success: true,
  students,
  companies,
  jobs,
  applications,
});


} catch (error) {
console.error("Placement Officer Dashboard Error:", error);


return res.status(500).json({
  success: false,
  message: "Unable to load placement officer dashboard data",
  error: error.message,
});


}
});

module.exports = router;
