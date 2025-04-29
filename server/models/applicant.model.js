const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
    fullName: {
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
    gender: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },

    phone: {
        type: String,
        required: true,
        unique: true,
    },
    skills: [String],
    resumePath: String,
    resumeScore: Number,
    status: { type: String, default: "" },
});

module.exports = mongoose.model("Applicant", applicantSchema);
