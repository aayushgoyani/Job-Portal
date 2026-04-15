import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Heart,
  Loader,
  Filter,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import Header from "../LandingPage/components/Header";
import Footer from "../LandingPage/components/Footer";

const JOB_TYPES = ["Remote", "Full-Time", "Part-Time", "Internship", "Contract"];

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      if (location) params.set("location", location);
      if (type) params.set("type", type);
      if (minSalary) params.set("minSalary", minSalary);
      if (maxSalary) params.set("maxSalary", maxSalary);
      if (user?._id) params.set("userId", user._id);

      const url = `${API_PATHS.JOBS.GET_ALL_JOBS}${params.toString() ? `?${params}` : ""}`;
      const res = await axiosInstance.get(url);
      setJobs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user?._id]);

  const handleSearch = (e) => {
    e?.preventDefault();
    fetchJobs();
  };

  const handleSaveJob = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
      setJobs((prev) =>
        prev.map((j) =>
          j._id === jobId ? { ...j, isSaved: true } : j
        )
      );
    } catch (err) {
      console.error("Save job failed", err);
    }
  };

  const handleUnsaveJob = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
      setJobs((prev) =>
        prev.map((j) =>
          j._id === jobId ? { ...j, isSaved: false } : j
        )
      );
    } catch (err) {
      console.error("Unsave job failed", err);
    }
  };

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
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Find Your Next Role
            </h1>
            <p className="text-gray-500 font-medium text-lg">Browse through hundreds of curated tech opportunities.</p>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-3 mb-10 flex flex-col lg:flex-row gap-2"
          >
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, keywords, or company"
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50/50 border-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700"
              />
            </div>

            <div className="flex-1 relative group">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, state, or remote"
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50/50 border-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-8 py-5 rounded-2xl border transition-all font-bold flex items-center gap-3 ${showFilters
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <button
                type="submit"
                className="px-10 py-5 rounded-2xl btn-gradient font-bold text-lg"
              >
                Search
              </button>
            </div>
          </form>


          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-white rounded-xl border border-gray-200 p-4 mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">Job type</span>
                <button
                  type="button"
                  onClick={() => setType("")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(type === t ? "" : t)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${type === t
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <span className="font-medium text-gray-700 block mb-3">Salary range (USD)</span>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</div>
                    <input
                      type="number"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                      placeholder="Min"
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700"
                    />
                  </div>
                  <div className="text-gray-300 font-bold">-</div>
                  <div className="flex-1 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</div>
                    <input
                      type="number"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                      placeholder="Max"
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}


          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Finding the best roles...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-2xl font-black text-gray-900">No jobs found</p>
              <p className="text-gray-500 font-medium mt-2 max-w-sm">We couldn't find any positions matching your criteria. Try adjusting your search or filters.</p>
              <button
                onClick={() => { setKeyword(""); setLocation(""); setType(""); setMinSalary(""); setMaxSalary(""); fetchJobs(); }}
                className="mt-8 text-blue-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/job/${job._id}`)}
                  className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all cursor-pointer group card-hover relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">

                    <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform duration-500">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2">
                            <span className="text-gray-600 font-bold text-sm">
                              {job.company?.companyName || job.company?.name || "Premium Company"}
                            </span>
                            {job.location && (
                              <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </div>
                            )}
                          </div>
                        </div>
                        {user && (
                          <button
                            type="button"
                            onClick={(e) =>
                              job.isSaved
                                ? handleUnsaveJob(e, job._id)
                                : handleSaveJob(e, job._id)
                            }
                            className="p-3 rounded-2xl bg-gray-50 hover:bg-red-50 group/save transition-colors"
                          >
                            <Heart
                              className={`w-6 h-6 transition-all ${job.isSaved
                                ? "fill-red-500 text-red-500 scale-110"
                                : "text-gray-400 group-hover/save:text-red-400"
                                }`}
                            />
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 mt-6">
                        <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest">
                          {job.type}
                        </span>
                        {job.category && (
                          <span className="px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-black uppercase tracking-widest">
                            {job.category}
                          </span>
                        )}
                        {formatSalary(job.salaryMin, job.salaryMax) && (
                          <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-black uppercase tracking-widest">
                            {formatSalary(job.salaryMin, job.salaryMax)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>


                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-16 -translate-y-16 opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
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

export default JobSeekerDashboard;
