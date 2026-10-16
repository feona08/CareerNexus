const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Notification = require("../models/Notification");

// GET: Fetch notifications for a student
router.get("/:studentId", async (req, res) => {
try {
const { studentId } = req.params;

```
if (!mongoose.Types.ObjectId.isValid(studentId)) {
  return res.status(400).json({
    success: false,
    message: "Invalid student ID",
  });
}

const notifications = await Notification.find({ studentId })
  .populate("jobId")
  .sort({ createdAt: -1 });

return res.status(200).json({
  success: true,
  count: notifications.length,
  notifications,
});
```

} catch (error) {
console.error("Notification loading error:", error);

```
return res.status(500).json({
  success: false,
  message: "Failed to load notifications",
  error: error.message,
});
```

}
});

// GET: Count unread notifications
router.get("/:studentId/unread-count", async (req, res) => {
try {
const { studentId } = req.params;

```
if (!mongoose.Types.ObjectId.isValid(studentId)) {
  return res.status(400).json({
    success: false,
    message: "Invalid student ID",
  });
}

const count = await Notification.countDocuments({
  studentId,
  isRead: false,
});

return res.status(200).json({
  success: true,
  count,
});
```

} catch (error) {
console.error("Unread notification count error:", error);

```
return res.status(500).json({
  success: false,
  message: "Failed to count notifications",
  error: error.message,
});
```

}
});

// PATCH: Mark one notification as read
router.patch("/:studentId/:notificationId/read", async (req, res) => {
try {
const { studentId, notificationId } = req.params;

```
if (
  !mongoose.Types.ObjectId.isValid(studentId) ||
  !mongoose.Types.ObjectId.isValid(notificationId)
) {
  return res.status(400).json({
    success: false,
    message: "Invalid student ID or notification ID",
  });
}

const notification = await Notification.findOneAndUpdate(
  {
    _id: notificationId,
    studentId,
  },
  { isRead: true },
  { new: true }
);

if (!notification) {
  return res.status(404).json({
    success: false,
    message: "Notification not found",
  });
}

return res.status(200).json({
  success: true,
  message: "Notification marked as read",
  notification,
});
```

} catch (error) {
console.error("Mark notification read error:", error);

```
return res.status(500).json({
  success: false,
  message: "Failed to mark notification as read",
  error: error.message,
});
```

}
});

// PATCH: Mark all notifications as read for a student
router.patch("/:studentId/read-all", async (req, res) => {
try {
const { studentId } = req.params;

```
if (!mongoose.Types.ObjectId.isValid(studentId)) {
  return res.status(400).json({
    success: false,
    message: "Invalid student ID",
  });
}

await Notification.updateMany(
  { studentId, isRead: false },
  { isRead: true }
);

return res.status(200).json({
  success: true,
  message: "All notifications marked as read",
});
```

} catch (error) {
console.error("Mark all notifications read error:", error);

```
return res.status(500).json({
  success: false,
  message: "Failed to mark all notifications as read",
  error: error.message,
});
```

}
});

// DELETE: Delete one notification
router.delete("/:studentId/:notificationId", async (req, res) => {
try {
const { studentId, notificationId } = req.params;

```
if (
  !mongoose.Types.ObjectId.isValid(studentId) ||
  !mongoose.Types.ObjectId.isValid(notificationId)
) {
  return res.status(400).json({
    success: false,
    message: "Invalid student ID or notification ID",
  });
}

const notification = await Notification.findOneAndDelete({
  _id: notificationId,
  studentId,
});

if (!notification) {
  return res.status(404).json({
    success: false,
    message: "Notification not found",
  });
}

return res.status(200).json({
  success: true,
  message: "Notification deleted successfully",
});
```

} catch (error) {
console.error("Delete notification error:", error);


return res.status(500).json({
  success: false,
  message: "Failed to delete notification",
  error: error.message,
});


}
});

module.exports = router;
