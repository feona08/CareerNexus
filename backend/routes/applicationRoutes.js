const express = require("express");
const router = express.Router();

const Application = require("../models/Application");

router.post("/apply", async (req, res) => {
  try {
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

    const application = new Application({
      studentName,
      studentEmail,
      jobId,
      jobTitle,
      companyName,
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
    const applications = await Application.find().sort({ createdAt: -1 });

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