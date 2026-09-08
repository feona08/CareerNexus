const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  department: {
    type: String,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },

  cgpa: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  
  password: {
  type: String,
  required: true,
},

  linkedin: {
    type: String,
  },

  github: {
    type: String,
  },

  skills: [
    {
      type: String,
    },
  ],

  resume: {
    type: String,
  },

  certificate: {
    type: String,
  },

  applications: [
    {
      company: String,
      status: String,
    },
  ],

  interviews: [
    {
      company: String,
      date: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Student", studentSchema);