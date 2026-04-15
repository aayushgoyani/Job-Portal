import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Mail,
  FileText,
  Loader,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import Header from "../LandingPage/components/Header";
import Footer from "../LandingPage/components/Footer";

const ApplicationViewer = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const jobIdParam = searchParams.get("jobId") || "";

  const [jobs, setJobs] = useState([]);
  const [jobLoading, setJobLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(jobIdParam);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusLoading, setStatusLoading] = useState();

  const selectedJob = useMemo(
    () => jobs.find((j) => j._id === selectedJobId),
    [jobs, selectedJobId]
  );

  const fetchJobs = async () => {
    setJobLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);
      const list = res.data || [];
      setJobs(list);

      if (!selectedJobId && list.length > 0) {
        setSelectedJobId(list[0]._id);
        setSearchParams({ jobId: list[0]._id });
      }
    } catch (err) {
      setJobs([]);
      setError(err.response?.data?.message || "Failed to load your jobs.");
    } finally {
      setJobLoading(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    if (!jobId) return;
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId));
      setApplications(res.data || []);
    } catch (err) {
      setApplications([]);
      setError(
        err.response?.data?.message || "Failed to load applicants for this job."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

  }, []);

  useEffect(() => {
    if (selectedJobId) fetchApplicants(selectedJobId);

  }, [selectedJobId]);

  const handleSelectJob = (e) => {
    const nextId = e.target.value;
    setSelectedJobId(nextId);
    setSearchParams(nextId ? { jobId: nextId } : {});
  };

  const updateStatus = async (applicationId, status) => {
    setStatusLoading((prev) => ({ ...prev, [applicationId]: true }));
    try {
      await axiosInstance.put(API_PATHS.APPLICATIONS.UPDATE_STATUS(applicationId), {
        status,
      });
      setApplications((prev) =>
        prev.map((a) => (a._id === applicationId ? { ...a, status } : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setStatusLoading((prev) => ({ ...prev, [applicationId]: false }));
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
                Applicants
              </h1>
              <p className="text-gray-600 mt-1">
                Review candidates and update application statuses.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  fetchJobs();
                  if (selectedJobId) fetchApplicants(selectedJobId);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a job
            </label>
            {jobLoading ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader className="w-4 h-4 animate-spin" />
                Loading your jobs…
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-gray-600">
                You haven’t posted any jobs yet.{" "}
                <button
                  type="button"
                  onClick={() => navigate("/post-job")}
                  className="text-blue-600 hover:underline"
                >
                  Post a job
                </button>
              </div>
            ) : (
              <select
                value={selectedJobId}
                onChange={handleSelectJob}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {jobs.map((j) => (
                  <option key={j._id} value={j._id}>
                    {j.title} {j.isClosed ? "(Closed)" : ""} —{" "}
                    {j.applicationCount || 0} applicant
                    {(j.applicationCount || 0) === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            )}
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
          ) : !selectedJobId ? null : applications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-600">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No applicants yet</p>
              <p className="text-sm mt-1">
                When candidates apply, they’ll show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, idx) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 overflow-hidden">
                          {app.applicant?.avatar ? (
                            <img
                              src={app.applicant.avatar}
                              alt={app.applicant?.name || "Applicant"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {app.applicant?.name || "Applicant"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {app.applicant?.email || "—"}
                            </span>
                            {app.job?.title && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="inline-flex items-center gap-1">
                                  <Briefcase className="w-4 h-4 text-gray-400" />
                                  {app.job.title}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-600">
                              Status:
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-sm">
                              {app.status}
                            </span>
                            {app.applicant?.resume && (
                              <a
                                href={app.applicant.resume}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                              >
                                <FileText className="w-4 h-4" />
                                Resume
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        disabled={statusLoading[app._id]}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      {statusLoading[app._id] && (
                        <Loader className="w-4 h-4 animate-spin text-gray-500" />
                      )}
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

export default ApplicationViewer