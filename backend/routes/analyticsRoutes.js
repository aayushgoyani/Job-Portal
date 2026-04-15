const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { getEmployerAnalytics, getPlatformAnalytics } = require("../controllers/analyticsController");
 
router.get("/overview", protect, getEmployerAnalytics);
router.get("/platform", getPlatformAnalytics);

module.exports = router;