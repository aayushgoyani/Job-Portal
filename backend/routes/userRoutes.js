const express = require("express");
const {
    updateProfile,
    deleteResumeProfile,
    getpublicProfile,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();


router.put("/profile", protect, updateProfile);

router.put("/update-profile", protect, updateProfile);


router.delete("/resume", protect, deleteResumeProfile);
router.post("/resume", protect, deleteResumeProfile);


router.get("/:id", getpublicProfile);

module.exports = router;