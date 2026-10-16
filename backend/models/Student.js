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

    // Personal Details
  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  phone: {
    type: String,
  },

  gender: {
    type: String,
  },

  dateOfBirth: {
    type: String,
  },

  address: {
    type: String,
  },

  city: {
    type: String,
  },

  state: {
    type: String,
  },

  pinCode: {
    type: String,
  },

  // Academic Details
  tenthSchool: {
    type: String,
  },

  tenthBoard: {
    type: String,
  },

  tenthYear: {
    type: String,
  },

  tenthPercentage: {
    type: String,
  },

  pucCollege: {
    type: String,
  },

  pucBoard: {
    type: String,
  },

  pucYear: {
    type: String,
  },

  pucPercentage: {
    type: String,
  },

  ugDegree: {
    type: String,
  },

  ugUniversity: {
    type: String,
  },

  ugSpecialization: {
    type: String,
  },

  ugYear: {
    type: String,
  },

  ugCgpa: {
    type: String,
  },

  pgDegree: {
    type: String,
  },

  pgUniversity: {
    type: String,
  },

  pgSpecialization: {
    type: String,
  },

  pgYear: {
    type: String,
  },

  pgCgpa: {
    type: String,
  },

  // Career Preferences
  preferredRole: {
    type: String,
  },

  preferredLocation: {
    type: String,
  },

  workPreference: {
    type: String,
  },

  interests: [
    {
      type: String,
    },
  ],


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