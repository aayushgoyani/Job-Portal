const fs = require('fs');
const path = require('path');
const User = require('../models/User');


exports.updateProfile = async (req, res) => {
    try {
        const { name, email, avatar, companyName, companyDescription, companyLogo, resume, phone, linkedin } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.email = email || user.email;
        user.avatar = avatar || user.avatar;
        user.resume = resume || user.resume;
        user.phone = phone || user.phone;
        user.linkedin = linkedin || user.linkedin;

        
        if (user.role === "employer") {
            user.companyName = companyName || user.companyName;
            user.companyDescription = companyDescription || user.companyDescription;
            user.companyLogo = companyLogo || user.companyLogo;
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            phone: user.phone,
            role: user.role,
            companyName: user.companyName,
            companyDescription: user.companyDescription,
            companyLogo: user.companyLogo,
            resume: user.resume || '',
            linkedin: user.linkedin || '',
        });


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.deleteResumeProfile = async (req, res) => {
    try {
        const { resumeUrl } = req.body; 

        
        const filename = resumeUrl?.split('/')?.pop();

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role !== "jobseeker")
            return res.status(403).json({ message: "Only jobseekers can delete resume" });

        if (!filename) {
            return res.status(400).json({ message: "resumeUrl is required" });
        }

        
        const filePath = path.join(__dirname, '../uploads', filename);

        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);  
        }

        
        user.resume = '';
        await user.save();

        res.json({ message: "resume deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

};


exports.getpublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" })

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};