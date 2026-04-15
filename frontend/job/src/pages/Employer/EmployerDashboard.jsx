import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  CheckCircle,
  TrendingUp,
  Clock,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import Header from "../LandingPage/components/Header";
import Footer from "../LandingPage/components/Footer";

const EmployerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-900/5 group hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7" />
        </div>
        {trend !== undefined && (
          <div className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 ${trend >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            <TrendingUp className={`w-3 h-3 ${trend < 0 ? "rotate-180" : ""}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">{title}</h3>
        <p className="text-4xl font-black text-gray-900 leading-none">{value || 0}</p>
      </div>
    </motion.div>
  );

  const chartData = stats?.data?.chartData || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Header />
        <div className="flex flex-col items-center justify-center pt-48">
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="mt-4 text-gray-500 font-bold animate-pulse">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="pt-32 pb-24 container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Employer Control Center</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-black text-gray-900 tracking-tight"
              >
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Recruiter</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 font-medium text-lg mt-2"
              >
                Here's what's happening with your recruitment funnel today.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/post-job"
                className="btn-gradient px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 flex items-center gap-3 group"
              >
                <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                Post New Opening
              </Link>
            </motion.div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <StatCard
              title="Active Job Postings"
              value={stats?.counts?.totalActiveJobs}
              icon={Briefcase}
              trend={stats?.counts?.trends?.activeJobs}
              color="bg-gradient-to-br from-blue-500 to-blue-700"
              delay={0.1}
            />
            <StatCard
              title="Total Applicants"
              value={stats?.counts?.totalApplications}
              icon={Users}
              trend={stats?.counts?.trends?.totalApplicants}
              color="bg-gradient-to-br from-purple-500 to-purple-700"
              delay={0.2}
            />
            <StatCard
              title="Successful Hires"
              value={stats?.counts?.totalHired}
              icon={CheckCircle}
              trend={stats?.counts?.trends?.totalHired}
              color="bg-gradient-to-br from-green-500 to-emerald-700"
              delay={0.3}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-900/5"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-gray-900">Application Performance</h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm font-bold text-gray-500">
                  <Clock className="w-4 h-4" />
                  Last 7 Days
                </div>
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="#2563eb"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorApps)"
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-900/5"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-gray-900">Recent Pulse</h2>
                <Link to="/applicants" className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  <MoreHorizontal className="w-6 h-6" />
                </Link>
              </div>
              <div className="space-y-8">
                {stats?.data?.recentApplications?.length > 0 ? (
                  stats.data.recentApplications.map((app, index) => (
                    <motion.div
                      key={app._id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + (index * 0.1) }}
                      className="flex items-center gap-5 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-0.5 border border-gray-100 transition-transform group-hover:scale-110 shadow-sm">
                        {app.applicant?.avatar ? (
                          <img src={app.applicant.avatar} alt="" className="w-full h-full rounded-[0.85rem] object-cover" />
                        ) : (
                          <div className="w-full h-full rounded-[0.85rem] bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl">
                            {(app.applicant?.name || "U")[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-black truncate text-lg group-hover:text-blue-600 transition-colors">
                          {app.applicant?.name}
                        </p>
                        <p className="text-sm text-gray-500 font-bold truncate">
                          Applied: <span className="text-gray-700">{app.job?.title}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Date</div>
                        <div className="text-xs font-bold text-gray-900">
                          {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                      <Clock className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-bold">No new activity to show</p>
                  </div>
                )}
              </div>

              <Link to="/applicants" className="mt-10 w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-center block hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10">
                Manage All Applications
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmployerDashboard;
