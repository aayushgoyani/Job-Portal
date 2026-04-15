const mongoose = require("mongoose");
require("dotenv").config();
const Job = require("./models/Job");
const User = require("./models/User");

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/jobportal");
        console.log("Connected to MongoDB");

        const jobCount = await Job.countDocuments();
        const userCount = await User.countDocuments();

        console.log(`Job count: ${jobCount}`);
        console.log(`User count: ${userCount}`);

        if (jobCount > 0) {
            const jobs = await Job.find().populate("company", "name email");
            console.log("Sample Jobs:", JSON.stringify(jobs.slice(0, 2), null, 2));
        } else {
            console.log("No jobs found in the database.");
        }

        process.exit(0);
    } catch (err) {
        console.error("Error checking DB:", err);
        process.exit(1);
    }
};

checkDB();
