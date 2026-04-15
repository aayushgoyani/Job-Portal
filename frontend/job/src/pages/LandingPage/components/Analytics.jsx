import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Briefcase, Target } from 'lucide-react'
import axiosInstance from '../../../Utils/axiosInstance'
import { API_PATHS } from '../../../Utils/apiPaths'

const Analytics = () => {
    const [platformStats, setPlatformStats] = useState({
        activeUsers: '2.4M+',
        jobsPosted: '150K+',
        successfulHires: '89K+',
        matchRate: '94%'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get(API_PATHS.DASHBOARD.PLATFORM_STATS);
                setPlatformStats(res.data);
            } catch (err) {
                console.error("Failed to fetch platform stats", err);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            icon: Users,
            title: 'Active Users',
            value: platformStats.activeUsers,
            growth: '+15%',
            color: '#3B82F6' 
        },
        {
            icon: Briefcase,
            title: 'Jobs Posted',
            value: platformStats.jobsPosted,
            growth: '+22%',
            color: '#A855F7' 
        },
        {
            icon: Target,
            title: 'Successful Hires',
            value: platformStats.successfulHires,
            growth: '+18%',
            color: '#10B981' 
        },
        {
            icon: TrendingUp,
            title: 'Match Rate',
            value: platformStats.matchRate,
            growth: '+8%',
            color: '#F59E0B' 
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
                        Real-Time
                        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mt-2">Platform Analytics</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Data-driven results that showcase our commitment to connecting the world's best talent with the most innovative companies.
                    </p>
                </motion.div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="group p-8 rounded-3xl bg-gray-50 border border-gray-100/50 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 card-hover"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="p-4 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 group-hover:scale-110 transition-transform duration-500">
                                    <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                                </div>
                                <span className="flex items-center space-x-1 py-1 px-3 rounded-full bg-green-50 text-green-600 text-sm font-bold border border-green-100">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{stat.growth}</span>
                                </span>
                            </div>

                            <h3 className="text-4xl font-extrabold text-gray-900 mb-2 truncate">{stat.value}</h3>
                            <p className="text-gray-500 font-semibold tracking-wide uppercase text-xs">{stat.title}</p>

                            
                            <div className="mt-6 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '70%' }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: stat.color }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Analytics