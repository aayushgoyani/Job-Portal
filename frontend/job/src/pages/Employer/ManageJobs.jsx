import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Users,
  Pencil,
  Trash2,
  Eye,
  PlusCircle,
  Loader,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import Header from "../LandingPage/components/Header";
import Footer from "../LandingPage/components/Footer";

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState();
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);
      setJobs(res.data || []);
    } catch (err) {
      setJobs([]);
      setError(
        err.response?.data?.message ||
          "Failed to load your jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const stats = useMemo(() => {
    const total = jobs.length;
    const active = jobs.filter((j) => !j.isClosed).length;
    const closed = total - active;
    const totalApplicants = jobs.reduce(
      (sum, j) => sum + (j.applicationCount || 0),
      0
    );
    return { total, active, closed, totalApplicants };
  }, [jobs]);

  const setJobActionLoading = (jobId, next) => {
    setActionLoading((prev) => ({ ...prev, [jobId]: next }));
  };

  const handleToggleClose = async (job) => {
    const jobId = job._id;
    setJobActionLoading(jobId, true);
    try {
      await axiosInstance.post(API_PATHS.JOBS.TOGGLE_CLOSE(jobId));
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, isClosed: !j.isClosed } : j))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update job status");
    } finally {
      setJobActionLoading(jobId, false);
    }
  };

  const handleDelete = async (job) => {
    const ok = window.confirm(
      `Delete job "${job.title}"? This cannot be undone.`
    );
    if (!ok) return;
    const jobId = job._id;
    setJobActionLoading(jobId, true);
    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(jobId));
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job");
    } finally {
      setJobActionLoading(jobId, false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Manage Jobs
              </h1>
              <p className="text-gray-600 mt-1">
                Create, edit, close, and review applicants for your postings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/post-job")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
              Post a job
            </button>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total jobs</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {stats.active}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <ToggleRight className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Closed</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {stats.closed}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Applicants</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {stats.totalApplicants}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader className="w-10 h-10 animate-spin text-blue-600" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-600">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No jobs posted yet</p>
              <p className="text-sm mt-1">
                Create your first job posting to start receiving applications.
              </p>
              <button
                type="button"
                onClick={() => navigate("/post-job")}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium"
              >
                <PlusCircle className="w-5 h-5" />
                Post a job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, idx) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                            {job.location && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {job.location}
                              </span>
                            )}
                            <span className="text-gray-300">•</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                              {job.type}
                            </span>
                            {job.isClosed ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                                Closed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 text-green-700">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>
                              {job.applicationCount || 0} applicant
                              {(job.applicationCount || 0) === 1 ? "" : "s"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/applicants?jobId=${encodeURIComponent(job._id)}`)
                        }
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        Applicants
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/post-job?jobId=${encodeURIComponent(job._id)}`)
                        }
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleClose(job)}
                        disabled={actionLoading[job._id]}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        {job.isClosed ? (
                          <ToggleLeft className="w-4 h-4" />
                        ) : (
                          <ToggleRight className="w-4 h-4" />
                        )}
                        {job.isClosed ? "Reopen" : "Close"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(job)}
                        disabled={actionLoading[job._id]}
                        className="px-4 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
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

export default ManageJobs