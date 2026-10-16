const express = require("express");
const router = express.Router();

const Job = require("../models/Job");
const Student = require("../models/Student");
const Notification = require("../models/Notification");

// ==========================
// POST A JOB + CREATE NOTIFICATIONS
// ==========================

router.post("/post", async (req, res) => {
try {
const {
companyName,
jobTitle,
package: jobPackage,
location,
skills,
experience,
lastDate,
description,
} = req.body;


if (
  !companyName ||
  !jobTitle ||
  !jobPackage ||
  !location ||
  !skills ||
  !experience ||
  !lastDate ||
  !description
) {
  return res.status(400).json({
    success: false,
    message: "Please fill all job details.",
  });
}

// Save the job first
const job = new Job({
  companyName,
  jobTitle,
  package: jobPackage,
  location,
  skills,
  experience,
  lastDate,
  description,
});

await job.save();

// Find all registered students
const students = await Student.find({}, "_id");

// Create a notification for each student
if (students.length > 0) {
  const notifications = students.map((student) => ({
    studentId: student._id,
    jobId: job._id,
    message: `New job posted: ${jobTitle} at ${companyName}`,
    isRead: false,
  }));

  await Notification.insertMany(notifications);
}

return res.status(201).json({
  success: true,
  message: "Job posted successfully and student notifications created.",
  job,
  notificationsCreated: students.length,
});


} catch (error) {
console.error("Job posting/notification error:", error);


return res.status(500).json({
  success: false,
  message: error.message,
});


}
});

// ==========================
// GE
