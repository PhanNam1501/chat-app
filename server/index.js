const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const path = require('path');
const helmet = require('helmet');
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const uploadRoute = require("./Routes/uploadRoute");
const session = require('express-session');
const rateLimit = require('express-rate-limit');
require("dotenv").config();

const app = express();
const sessionSecret = process.env.SESSION_SECRET_KEY;

const sslOptions = {
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/cert.pem"),
};

https.createServer(sslOptions, app).listen(process.env.PORT || 443, () => {
  console.log("HTTPS server running on port " + (process.env.PORT || 443));
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    //console.log("Too many requests from:", req.ip);
    res.status(429).json({ message: "Too many login attempts. Try again later." });
  },
  standardHeaders: true,
  legacyHeaders: false,
});


app.use('/login', loginLimiter);

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,               // allow sending cookies
    ttl: 60 * 60 * 24,
}));
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true, // Prevent XSS attacks
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 1000 * 60 * 60 * 24, // Set session expiration
    }
}));

app.post('/login', (req, res) => {
    // Perform authentication

    req.session.authenticated = true; // Store authentication status in the session
    res.redirect('/');
});

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(
  helmet({
    hidePoweredBy: true, // Hides "X-Powered-By: Express"
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trusted.cdn.com"], // Add trusted script sources
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: { policy: "no-referrer" },
    frameguard: { action: "deny" }, // Prevent clickjacking
    xssFilter: true, // Older browsers, safe to keep
    noSniff: true,   // Prevent MIME-type sniffing
  })
);

app.disable("x-powered-by"); // Redundant if using helmet, but adds clarity // Add security headers
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.use("/api", uploadRoute);

app.get("/", (req, res) => {
    if (req.session.authenticated) {
        // User is authenticated, display their data
        res.send("Welcome to our chat app APIs..")
    } else {
        // User is not authenticated, redirect to login page
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: "An error occurred during logout. Please try again." });
        }

        // Clear the session cookie
        res.clearCookie('connect.sid', {
            path: '/',
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: 'lax'
        });

        // Redirect to login page
        res.redirect('/login');
    });
});


const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URL_1;

app.listen(port, (req, res) => {
    console.log(`Server running on port: ${port}`);
});
mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("MongoDB connection established"))
    .catch((error) => console.log("MongoDb connection failed: ", error.message));