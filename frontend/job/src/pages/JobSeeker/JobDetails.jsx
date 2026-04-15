import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Building2,
  DollarSign,
  Calendar,
  ArrowLeft,
  Heart,
  Loader,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import Header from "../LandingPage/components/Header";
import Footer from "../LandingPage/components/Footer";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (user?._id) params.set("userId", user._id);
        const url = `${API_PATHS.JOBS.GET_JOB_By_ID(jobId)}${params.toString() ? `?${params}` : ""}`;
        const res = await axiosInstance.get(url);
        setJob(res.data);
      } catch (err) {
        console.error("Failed to fetch job", err);
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchJob();
  }, [jobId, user?._id]);

  const handleApply = async () => {
    if (!isAuthenticated || user?.role !== "jobseeker") {
      navigate("/login");
      return;
    }
    setApplying(true);
    try {
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
      setJob((prev) => ({ ...prev, applicationStatus: "Applied" }));
    } catch (err) {
      console.error("Apply failed", err);
      alert(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSaving(true);
    try {
      if (job.isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        setJob((prev) => ({ ...prev, isSaved: false }));
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        setJob((prev) => ({ ...prev, isSaved: true }));
      }
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center pt-32 pb-16">
          <Loader className="w-10 h-10 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
          <button
            onClick={() => navigate("/find-jobs")}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to job listings
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      <main className="pt-32 pb-24 container mx-auto px-4">
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
            <span>Back to listings</span>
          </motion.button>

          <div className="grid lg:grid-cols-3 gap-10">
            
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-blue-900/5 border border-gray-50 relative overflow-hidden"
              >
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full translate-x-20 -translate-y-20 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-8 mb-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center border border-gray-100 shadow-sm">
                    <Building2 className="w-10 h-10 text-gray-400" />
                  </div>

                  <div className="flex-1">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      <span className="flex items-center gap-2 text-gray-700 font-bold p-1 pr-3 rounded-full bg-blue-50/50 border border-blue-100/30">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          <Building2 className="w-4 h-4" />
                        </div>
                        {job.company?.companyName || job.company?.name || "Premium Company"}
                      </span>
                      {job.location && (
                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                          <MapPin className="w-5 h-5 text-red-500" />
                          {job.location}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100 mb-10">
                  <div className="space-y-1">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Job Type</p>
                    <p className="text-gray-900 font-black flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      {job.type}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Salary Range</p>
                    <p className="text-gray-900 font-black flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      {formatSalary(job.salaryMin, job.salaryMax) || "Competitive"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Category</p>
                    <p className="text-gray-900 font-black">
                      {job.category || "General"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Experience</p>
                    <p className="text-gray-900 font-black">
                      {job.experience || "Entry Level"}
                    </p>
                  </div>
                </div>

                <div className="space-y-10">
                  <section>
                    <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                      <div className="w-2 h-8 bg-blue-600 rounded-full" />
                      About the Role
                    </h2>
                    <div className="text-gray-600 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                      {job.description}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                      <div className="w-2 h-8 bg-purple-600 rounded-full" />
                      Key Requirements
                    </h2>
                    <div className="text-gray-600 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                      {job.requirements}
                    </div>
                  </section>

                  {job.responsibilities && (
                    <section>
                      <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                        <div className="w-2 h-8 bg-green-600 rounded-full" />
                        Responsibilities
                      </h2>
                      <div className="text-gray-600 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                        {job.responsibilities}
                      </div>
                    </section>
                  )}
                </div>
              </motion.div>
            </div>

            
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="sticky top-32 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-gray-50 text-center"
              >
                <div className="mb-8">
                  <p className="text-gray-500 font-medium mb-2">Think you're a good fit?</p>
                  <h3 className="text-2xl font-black text-gray-900">Apply Today</h3>
                </div>

                <div className="space-y-4">
                  {job.applicationStatus ? (
                    <div className="w-full py-5 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center gap-3 font-black text-lg border border-green-100">
                      <CheckCircle className="w-6 h-6" />
                      {job.applicationStatus}
                    </div>
                  ) : (
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="w-full btn-gradient py-5 rounded-2xl font-black text-xl shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-3 group"
                    >
                      {applying ? (
                        <Loader className="w-6 h-6 animate-spin" />
                      ) : (
                        <span>Send Application</span>
                      )}
                    </button>
                  )}

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`w-full py-5 rounded-2xl font-black text-lg border-2 transition-all flex items-center justify-center gap-3 ${job.isSaved
                        ? "border-red-600 bg-red-50 text-red-600"
                        : "border-gray-100 text-gray-600 hover:border-gray-200"
                      }`}
                  >
                    <Heart className={`w-6 h-6 ${job.isSaved ? "fill-red-600" : ""}`} />
                    {job.isSaved ? "Saved to Profile" : "Save for Later"}
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Company Size</div>
                    <div className="text-gray-900 font-black">100-500</div>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="text-center">
                    <div className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Applications</div>
                    <div className="text-gray-900 font-black">150+</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetails;
