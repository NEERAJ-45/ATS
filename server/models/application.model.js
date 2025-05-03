const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Applicant",
        required: true,
    },
    resumePath: {
        type: String,
        required: true,
    },
    resumeScore: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["pending", "rejected", "accepted"],
        default: "pending",
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Application", applicationSchema);
