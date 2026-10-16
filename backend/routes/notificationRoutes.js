const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");

router.get("/:studentId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      studentId: req.params.studentId,
    })
      .populate("jobId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load notifications",
    });
  }
});

module.exports = router;