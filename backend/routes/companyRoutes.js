const express = require("express");
const router = express.Router();
const Company = require("../models/Company");

// =====================================
// COMPANY REGISTRATION
// =====================================
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


if (!companyName || !hrName || !email || !password) {
  return res.status(400).json({
    success: false,
    message: "Company name, HR name, email, and password are required.",
  });
}

const normalizedEmail = email.trim().toLowerCase();

// Check whether the company is already registered
const existingCompany = await Company.findOne({
  email: { $regex: `^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
});

if (existingCompany) {
  return res.status(409).json({
    success: false,
    message: "A company with this email is already registered. Please log in.",
  });
}

const company = new Company({
  companyName: companyName.trim(),
  hrName: hrName.trim(),
  email: normalizedEmail,
  password,
  website: website || "",
  location: location || "",
});

await company.save();

return res.status(201).json({
  success: true,
  message: "Company registered successfully.",
  company: {
    _id: company._id,
    id: company._id,
    companyName: company.companyName,
    hrName: company.hrName,
    email: company.email,
    website: company.website,
    location: company.location,
  },
});


} catch (error) {
console.error("Company registration error:", error);


return res.status(500).json({
  success: false,
  message: "Company registration failed.",
});


}
});

// =====================================
// COMPANY LOGIN
// =====================================
router.post("/login", async (req, res) => {
try {
const { email, password } = req.body;


if (!email || !password) {
  return res.status(400).json({
    success: false,
    message: "Email and password are required.",
  });
}

const normalizedEmail = email.trim().toLowerCase();

const escapedEmail = normalizedEmail.replace(
  /[.*+?^${}()|[\]\\]/g,
  "\\$&"
);

const company = await Company.findOne({
  email: {
    $regex: `^\\s*${escapedEmail}\\s*$`,
    $options: "i",
  },
});

if (!company) {
  return res.status(401).json({
    success: false,
    message: "Company not found. Please register first or check your email.",
  });
}

if (company.password !== password) {
  return res.status(401).json({
    success: false,
    message: "Incorrect password.",
  });
}

return res.status(200).json({
  success: true,
  role: "company",
  message: "Company Login Successful",
  company: {
    _id: company._id,
    id: company._id,
    companyName: company.companyName,
    hrName: company.hrName,
    email: company.email,
    website: company.website,
    location: company.location,
  },
});


} catch (error) {
console.error("Company login error:", error);


return res.status(500).json({
  success: false,
  message: "Company login failed.",
});


}
});

// =====================================
// GET ALL COMPANIES
// =====================================
router.get("/all", async (req, res) => {
try {
const companies = await Company.find().select("-password");


return res.status(200).json({
  success: true,
  companies,
});


} catch (error) {
console.error("Fetching companies error:", error);


return res.status(500).json({
  success: false,
  message: "Failed to fetch companies.",
});


}
});

module.exports = router;
