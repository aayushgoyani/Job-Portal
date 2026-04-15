const mongoose = require("mongoose");
const uri = "mongodb://127.0.0.1:27017/jobportal";

async function testConnection() {
  try {
    console.log("Attempting connect to local DB...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log("Success! Local DB is accessible.");
    process.exit(0);
  } catch (error) {
    console.error("Local DB Connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
