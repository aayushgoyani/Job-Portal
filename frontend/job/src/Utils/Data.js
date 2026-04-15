import {
    Search,
    Users,
    FileText,
    MessageSquare,
    BarChart3,
    Shield,
    Clock,
    Award,
    Briefcase,
    Building2,
    LayoutDashboard,
    Plus,
} from "lucide-react";

export const jobSeekerFeatures = [
    {
        icon: Search,
        title: "Smart Job Matching",
        description:
        "AI-powered algorithm matches you with relevant opportuinutes based on you skill and preferences.",
    },
    {
        icon: FileText,
        title: "Resume Builder",
        description:
        "Create professional resume with our intuitive builder and template designed by experts",
    },
    {
        icon: MessageSquare,
        title: "Direct Communication",
        description:
        "Connect directly with hiring managers and recuiters through our secure message",
    },
    {
        icon: Award,
        title: "Skill Assessment",
        description:
        "Showcase your certifications and achievements to stand out from other candidates.",
    },
];

export const employerFeatures =[
    {
        icon: Users,
        title: "Talent Pool Access",
        description:
        "Access our vast database of pre=screened candidates and find per",
    },
    {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
        "Track job performance with detailed analytics, including views, applications, and hiring trends.",
},
{
    icon: Shield,
    title: "Secure & Trusted Platform",
    description:
        "Your data is protected with enterprise-grade security, ensuring privacy and safe transactions.",
},
{
    icon: Clock,
    title: "Time-Saving Automation",
    description:
        "Automate job postings, application tracking, and notifications to save time and boost productivity.",
},

];


export const NAVIGATION_MENU = [
    {id: "employer-dashboard", name: "Dashboard", icon: LayoutDashboard },
    {id: "post-job", name: "Post Job", icon: Plus },
    {id: "manage-jobs", name: "Manage Jobs", icon: Briefcase },
    {id: "company-profile", name: "Company Profile", icon: Building2 },
];


export const CATEGORIES =[
    {value: "Engineering", label: "Engineering"},
    {value: "Design", label: "Design"},
    {value: "Marketing", label: "Marketing"},
    {value: "Sales", label: "Sales"},
    {value: "IT Software", label: "IT Software"},
    {value: "Customer-service", label: "Customer-service"},
    {value: "Product", label: "Product"},
    {value: "Operations", label: "Operation"},
    {value: "Finance", label: "Finance"},
    {value: "HR", label: "HR"},
    {value: "Other", label: "Other"},
];

export const JOB_TYPES = [
    {value: "Remote", label: "Remote"},
    {value: "Full-Time", label: "Full-Time"},
    {value: "Part-time", label: "Part-time"},
    {value: "Contract", label: "Contract"},
    {value: "Internship", label: "Internship"},
];

export const SALARY_RANGES =[
    
    "Less than $1000",
    "$1000 - $15,000",
    "More than $15,000",
];