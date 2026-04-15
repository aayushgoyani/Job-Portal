const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job: { type: mongoose.Schema.Types.ObjectId, ref: "job", required: true },
        applicant: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        status: {
            type: String,
            enum: ["Applied", "Under Review", "Accepted", "Rejected"],
            default: "Applied",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("application", applicationSchema);