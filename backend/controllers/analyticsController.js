const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

const getTrend = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
};

exports.getEmployerAnalytics = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const companyId = req.user._id;

        const now = new Date();
        const last7days = new Date(now);
        last7days.setDate(now.getDate() - 7);
        const prev7days = new Date(now);
        prev7days.setDate(now.getDate() - 14);

        
        const totalActiveJobs = await Job.countDocuments({
            company: companyId,
            isClosed: false,
        });
        const jobs = await Job.find({ company: companyId }).select("_id").lean();
        const jobIds = jobs.map((job) => job._id);

        const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
        const totalHired = await Application.countDocuments({
            job: { $in: jobIds},
            status: "Accepted",
        });

        

        
        const activeJobsLast7 = await Job.countDocuments({
            company: companyId,
            createdAt: { $gte: last7days, $lte: now },
        });

        const activeJobsPrev7 = await Job.countDocuments({
            company: companyId,
            createdAt: { $gte: prev7days, $lte: last7days },
        });

        const activeJobtrend = getTrend(activeJobsLast7, activeJobsPrev7);

        
        const applicationsLast7 = await Application.countDocuments({
            job: { $in: jobIds },
            createdAt: { $gte: last7days, $lte: now},
        });

        const applicationsPrev7 = await Application.countDocuments({
            job: { $in: jobIds },
            createdAt: { $gte: prev7days, $lte: last7days },
        });

        const applicantTrend = getTrend(applicationsLast7, applicationsPrev7);

        
        const hiresLast7 = await Application.countDocuments({
            job: { $in: jobIds },
            status: "Accepted",
            createdAt: { $gte: last7days, $lte: now },
        });

        const hiresPrev7 = await Application.countDocuments({
            job: { $in: jobIds },
            status: "Accepted",
            createdAt: { $gte: prev7days, $lte: last7days },
        });

        const hiredTrend = getTrend(hiresLast7, hiresPrev7);

        
        const recentJobs = await Job.find({ company: companyId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title location type createdAt isClosed");

        const recentApplications = await Application.find({
            job: { $in: jobIds },
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("applicant", "name email avatar")
        .populate("job", "title");

        
        const chartData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            
            const count = await Application.countDocuments({
                job: { $in: jobIds },
                createdAt: { $gte: date, $lt: nextDay }
            });
            
            chartData.push({
                name: days[date.getDay()],
                applications: count
            });
        }

        res.json({
            counts: {
                totalActiveJobs,
                totalApplications,
                totalHired,
                trends: {
                    activeJobs: activeJobtrend,
                    totalApplicants: applicantTrend,
                    totalHired: hiredTrend
                }
            },
            data: {
                recentJobs,
                recentApplications,
                chartData,
            },
        });
        
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch analytics", error: err.message });
    }
};

exports.getPlatformAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalHired = await Application.countDocuments({ status: "Accepted" });
        
        
        const activeUsers = Math.floor(totalUsers * 0.8) + "+";
        const jobsPosted = Math.floor(totalJobs * 1.2) + "+";
        const successfulHires = totalHired + "+";
        const matchRate = totalJobs > 0 ? Math.round((totalHired / totalJobs) * 100) : 0;

        res.json({
            activeUsers,
            jobsPosted,
            successfulHires,
            matchRate: matchRate + "%"
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch platform analytics", error: err.message });
    }
};