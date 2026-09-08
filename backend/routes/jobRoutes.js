const express = require("express");
const router = express.Router();

const Job = require("../models/Job");

// ==========================
// POST A JOB
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

    res.status(201).json({
      success: true,
      message: "Job Posted Successfully",
      job: job,
    });

  } catch (error) {
    console.error("Job posting error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================
// GET ALL JOBS
// ==========================

router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs: jobs,
    });

  } catch (error) {
    console.error("Fetching jobs error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;