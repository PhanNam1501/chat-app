const express = require("express")
const {registerUser, loginUser, findUser, getUser} = require("../Controllers/userController");
const {
    registerValidationRules,
    loginValidationRules,
    validate,
} = require("../middlewares/validateUser");
const path = require('path');
const fs = require('fs');
const rateLimit = require("express-rate-limit");
const router = express.Router();
const uploadsDir = path.join(__dirname, '../uploads');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    console.log("Too many requests from:", req.ip);
    res.status(429).json({ message: "Too many login attempts. Try again later." });
  },
  standardHeaders: true,
  legacyHeaders: false,
});


router.post("/register", registerUser, registerValidationRules, validate);
router.post("/login", loginLimiter, loginUser, loginValidationRules, validate);
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: "An error occurred during logout. Please try again." });
        }

        res.clearCookie("connect.sid", { path: "/" }); // Clear cookie
        res.status(200).json({ message: "Logged out successfully" });
    });
});
router.get('/avatar/:filename', (req, res) => {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(uploadsDir, filename);

    if (!filePath.startsWith(uploadsDir)) {
        return res.status(403).send('Access denied');
    }

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    res.sendFile(filePath);
});
router.get("/find/:userId", findUser);
router.get("/", getUser);
module.exports = router;