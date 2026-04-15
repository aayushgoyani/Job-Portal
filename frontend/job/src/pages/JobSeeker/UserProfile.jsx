import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Briefcase,
  Upload,
  Loader,
  CheckCircle,
  AlertCircle,
  FileText,
  Linkedin,
} from "lucide-react";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import Header from "../LandingPage/components/Header";
import Footer from "../LandingPage/components/Footer";

const UserProfile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
    linkedin: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      resume: null,
      linkedin: user.linkedin || "",
    });

  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        linkedin: formData.linkedin,
      };


      if (formData.resume) {
        const formDataUpload = new FormData();
        
        formDataUpload.append("image", formData.resume);

        try {
          const uploadRes = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formDataUpload, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          payload.resume = uploadRes.data.imageUrl;
        } catch (uploadErr) {
          console.error("Resume upload failed", uploadErr);
          alert("Failed to upload resume. Please try again.");
          setLoading(false);
          return;
        }
      }

      const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, payload);
      updateUser(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Update failed", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-50 rounded-full blur-[100px] opacity-30 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <Header />

      <main className="pt-32 pb-24 container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6"
            >
              <User className="w-3 h-3 text-blue-600" />
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Personal Account Settings</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black text-gray-900 tracking-tight mb-2"
            >
              Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Identity</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 font-medium text-lg"
            >
              Update your personal information and professional documents.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white p-8 md:p-12 relative overflow-hidden"
          >
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-5 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-700 font-bold"
              >
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span>Profile synchronization successful!</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-8 border-b border-gray-50">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden transition-transform group-hover:scale-105">
                    <span className="text-3xl font-black text-blue-600">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                    <Upload className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-black text-gray-900 mb-1">{formData.name || "Your Name"}</h3>
                  <p className="text-gray-400 font-bold text-sm tracking-wide">{user.role === "jobseeker" ? "Active Job Seeker" : "Company Recruiter"}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50/50 border border-gray-100 group-hover:border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-gray-900 font-bold shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Connection</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50/50 border border-gray-100 group-hover:border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-gray-900 font-bold shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">+1</div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50/50 border border-gray-100 group-hover:border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-gray-900 font-bold shadow-sm"
                    placeholder="234 567 890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">LinkedIn Profile</label>
                <div className="relative group">
                  <Linkedin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50/50 border border-gray-100 group-hover:border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-gray-900 font-bold shadow-sm"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              {user.role === "jobseeker" && (
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Professional Resume</label>
                  <div className="p-6 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/20 hover:border-blue-200 transition-colors">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-blue-600">
                        <Briefcase className="w-8 h-8" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        {user.resume ? (
                          <div className="mb-2">
                            <p className="text-gray-900 font-black">Current Document Active</p>
                            <a href={user.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-sm flex items-center justify-center md:justify-start gap-1">
                              View current resume <CheckCircle className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <p className="text-gray-500 font-bold mb-2">No resume uploaded yet</p>
                        )}
                        <label className="cursor-pointer inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700">
                          <Upload className="w-4 h-4" />
                          <span>{formData.resume ? formData.resume.name : "Select new document (PDF, DOCX)"}</span>
                          <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="hidden" />
                        </label>
                        <div className="mt-4 pt-4 border-t flex items-center gap-4">
                          <span className="text-sm text-gray-500 font-medium">Or</span>
                          <button
                            type="button"
                            onClick={() => navigate('/build-resume')}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                          >
                            <FileText className="w-4 h-4" /> Build Resume Online
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-gradient py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span>Security Save</span>
                      <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="px-10 py-5 rounded-2xl border-2 border-gray-100 text-gray-400 font-black hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                >
                  Logout
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
