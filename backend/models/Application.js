const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // ==========================
    // APPLICATION DETAILS
    // ==========================

    studentName: {
      type: String,
      required: true,
    },

    studentEmail: {
      type: String,
      required: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Applied",
    },

    // ==========================
    // PERSONAL DETAILS
    // ==========================

    firstName: String,
    lastName: String,
    phone: String,
    gender: String,
    dateOfBirth: String,
    address: String,
    city: String,
    state: String,
    pinCode: String,

    // ==========================
    // ACADEMIC DETAILS
    // ==========================

    tenthSchool: String,
    tenthBoard: String,
    tenthYear: String,
    tenthPercentage: String,

    pucCollege: String,
    pucBoard: String,
    pucYear: String,
    pucPercentage: String,

    ugDegree: String,
    ugUniversity: String,
    ugSpecialization: String,
    ugYear: String,
    ugCgpa: String,

    pgDegree: String,
    pgUniversity: String,
    pgSpecialization: String,
    pgYear: String,
    pgCgpa: String,

    // ==========================
    // CAREER DETAILS
    // ==========================

    preferredRole: String,
    preferredLocation: String,
    workPreference: String,

    interests: {
      type: [String],
      default: [],
    },

    department: String,
    year: String,
    cgpa: String,

    linkedin: String,
    github: String,

    skills: {
      type: [String],
      default: [],
    },

    // ==========================
    // DOCUMENTS
    // ==========================

    resume: String,
    certificate: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);