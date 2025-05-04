const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const session = require('express-session');
require("dotenv").config();

const app = express();
const sessionSecret = process.env.SESSION_SECRET_KEY;

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

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
    //res.send("Welcome to our chat app APIs..")
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
            return res.status(500).send('An error occurred while logging out.');
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
