const express = require("express")
const {registerUser, loginUser, findUser, getUser} = require("../Controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: "Logout failed" });
        }

        res.clearCookie("connect.sid", { path: "/" }); // Clear cookie
        res.status(200).json({ message: "Logged out successfully" });
    });
});
router.get("/find/:userId", findUser);
router.get("/", getUser);
module.exports = router;