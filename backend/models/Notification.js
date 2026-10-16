const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
studentId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Student",
required: true,
index: true,
},


jobId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Job",
  required: true,
},

message: {
  type: String,
  required: true,
  trim: true,
},

isRead: {
  type: Boolean,
  default: false,
},


},
{
timestamps: true,
}
);

module.exports = mongoose.model("Notification", notificationSchema);
