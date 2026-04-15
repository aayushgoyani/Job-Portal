import React from 'react';
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-100/50"
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">

                    
                    <div
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            JobPortal
                        </span>
                    </div>

                    
                    <nav className="hidden md:flex items-center space-x-10">
                        <button
                            type="button"
                            onClick={() => navigate("/find-jobs")}
                            className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-base relative group"
                        >
                            Find Jobs
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (isAuthenticated) {
                                    if (user?.role === "employer") {
                                        navigate("/employer-dashboard");
                                    } else {
                                        navigate("/employer-dashboard");
                                    }
                                } else {
                                    navigate("/login");
                                }
                            }}
                            className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-base relative group"
                        >
                            For Employers
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    </nav>

                    
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <div className="hidden lg:block text-right">
                                    <p className="text-sm font-semibold text-gray-900">{user?.name || user?.fullName}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate("/profile")}
                                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                    title="Profile"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        {(user?.name || user?.fullName || 'U')[0].toUpperCase()}
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate(user?.role === "employer" ? "/employer-dashboard" : "/my-applications")}
                                    className="btn-gradient px-6 py-2.5 rounded-xl font-medium"
                                >
                                    Dashboard
                                </button>

                                <button
                                    type="button"
                                    onClick={logout}
                                    className="text-gray-600 hover:text-red-600 font-medium px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-5 py-2.5 rounded-xl hover:bg-blue-50"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/signup")}
                                    className="btn-gradient px-7 py-2.5 rounded-xl font-medium"
                                >
                                    Signup
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </motion.header>
    );
};

export default Header;
