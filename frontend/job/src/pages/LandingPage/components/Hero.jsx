import { motion } from 'framer-motion';
import { ArrowRight, Users, Building2, TrendingUp, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Hero = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const stats = [
        { icon: Users, label: 'Active Users', value: '2.4M+' },
        { icon: Building2, label: 'Companies', value: '50K+' },
        { icon: TrendingUp, label: 'Jobs Posted', value: '150k' }
    ];

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        <span className="text-sm font-semibold text-blue-700 uppercase tracking-wider">The #1 Job Board for Tech</span>
                    </motion.div>

                    
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-[1.1]"
                    >
                        Discover Your Next
                        <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent italic">
                            Career Milestone
                        </span>
                    </motion.h1>

                    
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        Connecting top talent with industry leaders. Browse thousands of
                        curated job opportunities or post your own to find the perfect hire.
                    </motion.p>

                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
                    >
                        <button
                            onClick={() => navigate("/find-jobs")}
                            className="btn-gradient px-10 py-5 rounded-2xl font-bold text-xl flex items-center group"
                        >
                            <span>Explore Jobs</span>
                            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
                        </button>

                        <button
                            onClick={() => {
                                if (isAuthenticated) {
                                    navigate("/employer-dashboard");
                                } else {
                                    navigate("/login");
                                }
                            }}
                            className="bg-white border-2 border-gray-200 text-gray-700 px-10 py-5 rounded-2xl font-bold text-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300 shadow-sm"
                        >
                            Hire Talent
                        </button>
                    </motion.div>

                    
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="pt-12 border-t border-gray-100"
                    >
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-10 text-center">Industry Leading Stats</p>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="p-3 bg-gray-50 rounded-2xl">
                                            <stat.icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <span className="text-3xl md:text-4xl font-black text-gray-900">{stat.value}</span>
                                    </div>
                                    <span className="text-gray-500 font-medium">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero