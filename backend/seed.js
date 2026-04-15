const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Job = require("./models/Job");
const Application = require("./models/Application");

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        
        await User.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});
        console.log("Data cleared");

        
        const password = await bcrypt.hash("123456", 10);

        const users = [
            {
                name: "John Doe",
                email: "john@example.com",
                password,
                role: "jobseeker",
                avatar: "https://randomuser.me/api/portraits/men/1.jpg",
                resume: "",
            },
            {
                name: "Jane Smith",
                email: "jane@example.com",
                password,
                role: "jobseeker",
                avatar: "https://randomuser.me/api/portraits/women/2.jpg",
                resume: "",
            },
            {
                name: "Tech Corp",
                email: "hr@techcorp.com",
                password,
                role: "employer",
                companyName: "Tech Corp Inc.",
                companyDescription: "Leading innovation in tech.",
                companyLogo: "https://placehold.co/100x100?text=TC",
            },
            {
                name: "Creative Agency",
                email: "jobs@creative.com",
                password,
                role: "employer",
                companyName: "Creative Minds",
                companyDescription: "We design the future.",
                companyLogo: "https://placehold.co/100x100?text=CM",
            },
        ];

        const createdUsers = await User.insertMany(users);
        const employer1 = createdUsers.find(u => u.email === "hr@techcorp.com");
        const employer2 = createdUsers.find(u => u.email === "jobs@creative.com");

        console.log("Users created");

        
        const jobs = [
            {
                title: "Frontend Developer",
                company: employer1._id,
                type: "Full-Time",
                location: "San Francisco, CA",
                category: "Engineering",
                salaryMin: 80000,
                salaryMax: 120000,
                description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and ensuring a seamless user experience.",
                requirements: "- React.js\n- Tailwind CSS\n- 3+ years of experience",
            },
            {
                title: "Backend Engineer",
                company: employer1._id,
                type: "Remote",
                location: "Remote",
                category: "Engineering",
                salaryMin: 90000,
                salaryMax: 140000,
                description: "Join our backend team to build scalable APIs and microservices.",
                requirements: "- Node.js\n- MongoDB\n- Express.js",
            },
            {
                title: "Full Stack Developer",
                company: employer1._id,
                type: "Full-Time",
                location: "Austin, TX",
                category: "Engineering",
                salaryMin: 100000,
                salaryMax: 150000,
                description: "Work on both client-side and server-side logic.",
                requirements: "- MERN Stack\n- AWS\n- CI/CD",
            },
            {
                title: "DevOps Engineer",
                company: employer1._id,
                type: "Remote",
                location: "Remote",
                category: "Engineering",
                salaryMin: 110000,
                salaryMax: 160000,
                description: "Manage infrastructure and deployment pipelines.",
                requirements: "- Docker\n- Kubernetes\n- Jenkins",
            },
            {
                title: "UI/UX Designer",
                company: employer2._id,
                type: "Contract",
                location: "New York, NY",
                category: "Design",
                salaryMin: 60000,
                salaryMax: 90000,
                description: "Design beautiful and intuitive interfaces for our clients.",
                requirements: "- Figma\n- Adobe XD\n- Portfolio required",
            },
            {
                title: "Product Manager",
                company: employer2._id,
                type: "Full-Time",
                location: "London, UK",
                category: "Product",
                salaryMin: 100000,
                salaryMax: 150000,
                description: "Lead product development from conception to launch.",
                requirements: "- Agile methodology\n- 5+ years experience\n- Leadership skills",
            },
            {
                title: "Marketing Specialist",
                company: employer2._id,
                type: "Part-Time",
                location: "Los Angeles, CA",
                category: "Marketing",
                salaryMin: 40000,
                salaryMax: 60000,
                description: "Develop and execute marketing strategies.",
                requirements: "- SEO/SEM\n- Social Media Marketing\n- Content Creation",
            },
            {
                title: "Data Scientist",
                company: employer2._id,
                type: "Full-Time",
                location: "Boston, MA",
                category: "Data",
                salaryMin: 120000,
                salaryMax: 180000,
                description: "Analyze large datasets to derive actionable insights.",
                requirements: "- Python\n- Machine Learning\n- SQL",
            },
            {
                title: "Sales Representative",
                company: employer2._id,
                type: "Full-Time",
                location: "Chicago, IL",
                category: "Sales",
                salaryMin: 50000,
                salaryMax: 80000,
                description: "Drive sales and build relationships with clients.",
                requirements: "- Communication skills\n- Negotiation\n- CRM experience",
            },
            {
                title: "Mobile Developer",
                company: employer1._id,
                type: "Contract",
                location: "Remote",
                category: "Engineering",
                salaryMin: 90000,
                salaryMax: 130000,
                description: "Build native mobile applications for iOS and Android.",
                requirements: "- React Native or Flutter\n- iOS/Android deployment\n- API integration",
            },
        ];

        await Job.insertMany(jobs);
        console.log("Jobs created");

        process.exit();
    } catch (err) {
        console.error("Error seeding data:", err);
        process.exit(1);
    }
};

seedData();
