const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, minlength: 8, maxlength: 30},
        email: {type: String, required: true, minlength: 8, maxlength: 200, unique: true},
        password: {type: String, required: true, minlength: 8, maxlength: 1024, },
    },
    {
        timestamps: true,
    }
);
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;