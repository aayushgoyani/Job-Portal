const User = require("../models/User");
const jwt = require("jsonwebtoken");


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};


exports.register = async (req, res) => {
    try {
        const { name, email, password, avatar, role, phone } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "user already exists" });

        const user = await User.create({ name, email, password, role, avatar, phone });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            phone: user.phone || '',
            role: user.role,
            token: generateToken(user._id),
            companyName: user.companyName || '',
            
            companyDescription: user.companyDescription || user.comapnyDescription || '',
            companydescription: user.companyDescription || user.comapnyDescription || '',
            companyLogo: user.companyLogo || '',
            resume: user.resume || '',
        });


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if (role && user.role !== role) {
            return res.status(401).json({ message: "Account does not match the selected role." });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            phone: user.phone || '',
            role: user.role,
            token: generateToken(user._id),
            companyName: user.companyName || '',
            companyDescription: user.companyDescription || user.comapnyDescription || '',
            companydescription: user.companyDescription || user.comapnyDescription || '',
            companyLogo: user.companyLogo || '',
            resume: user.resume || '',
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getMe = async (req, res) => {
    res.json(req.user);
};