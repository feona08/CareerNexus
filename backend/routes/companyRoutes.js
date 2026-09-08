const express = require("express");
const router = express.Router();

const Company = require("../models/Company");

// ==========================
// Company Registration
// ==========================

router.post("/register", async (req, res) => {
  try {

    const {
      companyName,
      hrName,
      email,
      password,
      website,
      location,
    } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ email });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company already registered.",
      });
    }

    const company = new Company({
      companyName,
      hrName,
      email,
      password,
      website,
      location,
    });

    await company.save();

    res.status(201).json({
      success: true,
      message: "Company Registered Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

// ==========================
// Company Login
// ==========================

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(401).json({
        success: false,
        message: "Company not found",
      });
    }

    if (company.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    res.json({
      success: true,
      message: "Company Login Successful",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

module.exports = router;