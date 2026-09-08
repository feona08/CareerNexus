const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({

  companyName: {
    type: String,
    required: true,
  },

  hrName: {
    type: String,
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

  website: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  jobs: [
    {
      jobTitle: String,
      packageOffered: String,
      jobLocation: String,
      cgpa: Number,
      skills: String,
      deadline: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("Company", companySchema);