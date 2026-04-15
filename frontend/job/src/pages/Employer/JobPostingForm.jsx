import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Tag,
  DollarSign,
  FileText,
  ListChecks,
  Loader,
  AlertCircle,
  Save,
  ArrowLeft,
} from "lucide-react";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import Header from "../LandingPage/components/Header";
import Footer from "../LandingPage/components/Footer";

const JobPostingForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  const isEdit = Boolean(jobId);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    type: "Full-Time",
    location: "",
    category: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
    qualifications: "",
    responsibilities: "",
  });


  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.type &&
      form.description.trim() &&
      form.requirements.trim()
    );
  }, [form]);

  useEffect(() => {
    const loadJobIfEditing = async () => {
      if (!isEdit) return;
      setInitialLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_By_ID(jobId));
        const job = res.data;
        setForm({
          title: job.title || "",
          type: job.type || "Full-Time",
          location: job.location || "",
          category: job.category || "",
          salaryMin:
            job.salaryMin === null || job.salaryMin === undefined
              ? ""
              : String(job.salaryMin),
          salaryMax:
            job.salaryMax === null || job.salaryMax === undefined
              ? ""
              : String(job.salaryMax),
          description: job.description || "",
          requirements: job.requirements || "",
          qualifications: job.qualifications || "",
          responsibilities: job.responsibilities || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load job details.");
      } finally {
        setInitialLoading(false);
      }
    };

    loadJobIfEditing();
  }, [isEdit, jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizeNumber = (val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return Number.isFinite(num) ? num : undefined;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);

    const payload = {
      title: form.title.trim(),
      type: form.type,
      location: form.location.trim() || undefined,
      category: form.category.trim() || undefined,
      salaryMin: normalizeNumber(form.salaryMin),
      salaryMax: normalizeNumber(form.salaryMax),
      description: form.description.trim(),
      requirements: form.requirements.trim(),
      qualifications: form.qualifications.trim() || undefined,
      responsibilities: form.responsibilities.trim() || undefined,
    };


    try {
      if (isEdit) {
        await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), payload);
      } else {
        await axiosInstance.post(API_PATHS.JOBS.POST_JOB, payload);
      }
      setSuccess(true);
      setTimeout(() => navigate("/manage-jobs"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {isEdit ? "Edit Job" : "Post a Job"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEdit
                  ? "Update details for your job posting."
                  : "Create a job posting to start receiving applications."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          {initialLoading ? (
            <div className="flex justify-center py-16">
              <Loader className="w-10 h-10 animate-spin text-blue-600" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8"
            >
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-green-700">
                  Saved successfully. Redirecting…
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job title *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Frontend Developer"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job type *
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="Remote">Remote</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. Bengaluru, India"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. Engineering"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary min
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="salaryMin"
                          value={form.salaryMin}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g. 50000"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary max
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="salaryMax"
                          value={form.salaryMax}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g. 90000"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32"
                      placeholder="Describe the role, responsibilities, and what success looks like."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements *
                  </label>
                  <div className="relative">
                    <ListChecks className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="requirements"
                      value={form.requirements}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-28"
                      placeholder="List must-have skills and nice-to-haves."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualifications
                  </label>
                  <div className="relative">
                    <ListChecks className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="qualifications"
                      value={form.qualifications}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-24"
                      placeholder="Degrees, certifications, or specialized training required."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsibilities
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="responsibilities"
                      value={form.responsibilities}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-24"
                      placeholder="Key duties and day-to-day tasks."
                    />
                  </div>
                </div>


                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {isEdit ? "Save changes" : "Publish job"}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/manage-jobs")}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobPostingForm