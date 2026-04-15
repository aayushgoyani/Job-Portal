const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
    {
        jobseeker: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        job: { type: mongoose.Schema.Types.ObjectId, ref: "job", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SavedJob", savedJobSchema);