const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// File type filter (e.g., allow only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG are allowed."), false);
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // safe public folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Max 5MB
  }
});

router.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json({ message: "File uploaded successfully", file: req.file });
});

module.exports = router;
