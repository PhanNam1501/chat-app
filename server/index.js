const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
    res.send("Welcome to our chat app APIs..")
});

const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URL;

app.listen(port, (req, res) => {
    console.log(`Server running on port: ${port}`);
});
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("MongoDB connection established"))
    .catch((error) => console.log("MongoDb connection failed: ", error.message));
