import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Pencil, User, Mail, Shield, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Header from "../LandingPage/components/Header";
import Footer from "../LandingPage/components/Footer";

const EmployerProfilepage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Company Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your employer profile details displayed to candidates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/company-profile/edit")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 shadow-sm"
            >
              <Pencil className="w-4 h-4" />
              Edit profile
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                  {user.companyLogo ? (
                    <img
                      src={user.companyLogo}
                      alt={user.companyName || "Company logo"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.companyName || "Your company"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {user.companyDescription ||
                      "Add a short company description to attract better candidates."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <User className="w-4 h-4 text-gray-400" />
                  Account name
                </div>
                <p className="text-gray-900 mt-1">{user.name || "—"}</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email
                </div>
                <p className="text-gray-900 mt-1">{user.email || "—"}</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Shield className="w-4 h-4 text-gray-400" />
                  Role
                </div>
                <p className="text-gray-900 mt-1">{user.role}</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  Company logo
                </div>
                <p className="text-gray-600 mt-1 text-sm break-all">
                  {user.companyLogo || "—"}
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 border-t border-gray-100 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/post-job")}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Post a job
              </button>
              <button
                type="button"
                onClick={() => navigate("/manage-jobs")}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Manage jobs
              </button>
              <button
                type="button"
                onClick={() => navigate("/applicants")}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                View applicants
              </button>
              <button
                type="button"
                onClick={() => navigate("/build-resume")}
                className="px-5 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" /> Build Resume
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmployerProfilepage