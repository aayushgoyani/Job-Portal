import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Building2, Mail, Loader2, Save, ArrowLeft, Link as LinkIcon, Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Header from "../LandingPage/components/Header";
import Footer from "../LandingPage/components/Footer";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import toast from "react-hot-toast";

const EditProfileDetails = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    companyLogo: user?.companyLogo || "",
    logoFile: null,
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData };
      delete payload.logoFile;

      if (formData.logoFile) {
        const uploadData = new FormData();
        uploadData.append("image", formData.logoFile);

        const uploadRes = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        payload.companyLogo = uploadRes.data.imageUrl;
      }

      const res = await axiosInstance.put(
        API_PATHS.USER.UPDATE_PROFILE,
        payload
      );

      
      if (res.data.token) {
        login(res.data.user, res.data.token);
      } else {
        
        window.location.href = "/company-profile?updated=true";
        return;
      }

      toast.success("Profile updated successfully");
      navigate("/company-profile");

    } catch (err) {
      console.error("Update failed", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h1 className="text-xl font-bold text-gray-900">
                Edit Company Profile
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Update your personal and company information.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Details Section */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Personal Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. +1 234 567 890"
                    />
                  </div>
                </div>
              </div>


              <div className="border-t border-gray-100 my-4"></div>

              
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Company Details
                </h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Company Logo
                  </label>
                  <div className="flex items-center gap-6 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                      {formData.logoFile ? (
                        <img
                          src={URL.createObjectURL(formData.logoFile)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : formData.companyLogo ? (
                        <img
                          src={formData.companyLogo}
                          alt="Current"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span>{formData.logoFile ? "Change Image" : "Upload Logo"}</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => setFormData({ ...formData, logoFile: e.target.files[0] })}
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-2 font-medium">Recommended: Square PNG or JPG, max 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your company..."
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfileDetails;
