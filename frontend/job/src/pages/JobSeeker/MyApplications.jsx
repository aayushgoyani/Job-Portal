import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Loader, AlertCircle, Trash2 } from "lucide-react";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import Header from "../LandingPage/components/Header";
import Footer from "../LandingPage/components/Footer";

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS);
            setApplications(res.data || []);
        } catch (err) {
            console.error("Failed to fetch applications", err);
            setError("Failed to load your applications. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleRemoveApplication = async (id) => {
        if (!window.confirm("Are you sure you want to withdraw this application?")) return;

        try {
            await axiosInstance.delete(API_PATHS.APPLICATIONS.DELETE_APPLICATION(id));
            setApplications((prev) => prev.filter((app) => app._id !== id));
        } catch (err) {
            console.error("Failed to remove application", err);
            setError("Failed to withdraw application. Please try again.");
        }
    };


    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "accepted":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            case "applied":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pt-24 pb-16 container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-16">
                            <Loader className="w-10 h-10 animate-spin text-blue-600" />
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No applications yet</p>
                            <p className="text-sm mt-1">Start applying for jobs to see them here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((app) => (
                                <motion.div
                                    key={app._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                            {app.job?.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4 text-gray-400" />
                                                {app.job?.company?.companyName || app.job?.company?.name || "Company"}
                                            </span>
                                            {app.job?.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    {app.job.location}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </div>
                                        {app.status?.toLowerCase() === "applied" && (
                                            <button
                                                onClick={() => handleRemoveApplication(app._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Withdraw Application"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MyApplications;
