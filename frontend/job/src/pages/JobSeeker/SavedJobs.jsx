import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Building2,
  Heart,
  Loader,
  ArrowLeft,
} from "lucide-react";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import Header from "../LandingPage/components/Header";
import Footer from "../LandingPage/components/Footer";

const SavedJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchSavedJobs();
  }, [user]);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
      setSavedJobs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch saved jobs", err);
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
      setSavedJobs((prev) => prev.filter((sj) => sj.job._id !== jobId));
    } catch (err) {
      console.error("Unsave failed", err);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-50 rounded-full blur-[100px] opacity-30 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <Header />

      <main className="pt-32 pb-24 container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/find-jobs")}
            className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-10 transition-colors"
          >
            <div className="p-2 rounded-xl bg-white border border-gray-100 group-hover:border-blue-100 shadow-sm transition-all group-hover:shadow-md group-hover:scale-110">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span>Discover more jobs</span>
          </motion.button>

          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 mb-4"
              >
                <Heart className="w-3 h-3 text-red-600 fill-red-600" />
                <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">Favorites & Interests</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black text-gray-900 tracking-tight"
              >
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Saved Jobs</span>
              </motion.h1>
            </div>
            <p className="text-gray-500 font-bold">{savedJobs.length} Positions Bookmarked</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
              <p className="mt-4 text-gray-400 font-bold">Retrieving your favorites...</p>
            </div>
          ) : savedJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-20 text-center shadow-xl shadow-blue-900/5"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                <Heart className="w-10 h-10 text-gray-200" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">No jobs saved yet</h2>
              <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">Start browsing jobs and click the heart icon to keep track of opportunities you love.</p>
              <button
                onClick={() => navigate("/find-jobs")}
                className="btn-gradient px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20"
              >
                Browse Available Jobs
              </button>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {savedJobs.map((savedJob, index) => {
                const job = savedJob.job;
                return (
                  <motion.div
                    key={savedJob._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden"
                  >
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform shadow-sm">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>

                      <div
                        onClick={() => navigate(`/job/${job._id}`)}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-xl font-black text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            {job.type}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                          <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                            <Building2 className="w-4 h-4" />
                            {job.company?.companyName || "Premium Partner"}
                          </div>
                          {job.location && (
                            <div className="flex items-center gap-2 text-gray-400 font-medium text-sm">
                              <MapPin className="w-4 h-4 text-red-400" />
                              {job.location}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-400 font-medium text-sm">
                            <Briefcase className="w-4 h-4 text-purple-400" />
                            {job.category || "General"}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated Salary</p>
                          <p className="text-lg font-black text-gray-900">{formatSalary(job.salaryMin, job.salaryMax) || "Competitive"}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => handleUnsave(e, job._id)}
                            className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2 font-black text-xs"
                          >
                            <Heart className="w-5 h-5 fill-current" />
                            <span className="hidden sm:inline">Unsave</span>
                          </button>
                          <button
                            onClick={() => navigate(`/job/${job._id}`)}
                            className="px-6 py-3 rounded-xl bg-gray-900 text-white font-black hover:bg-black transition-all shadow-lg shadow-gray-900/10 text-xs"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SavedJobs;
