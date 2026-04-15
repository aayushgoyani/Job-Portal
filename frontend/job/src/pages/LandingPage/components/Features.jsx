import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase } from 'lucide-react';
import { employerFeatures, jobSeekerFeatures } from '../../../Utils/Data';

const Features = () => {
    return (
        <section className="py-32 bg-gray-50 relative overflow-hidden">
            
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        Powerful Features
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                        Everything You Need to
                        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Power Your Success</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Explore our robust set of tools optimized for the modern job market. We make hiring and job hunting intuitive and efficient.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    
                    <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700 opacity-50" />

                        <div className="relative z-10">
                            <div className="flex items-center space-x-4 mb-12">
                                <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/30">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-extrabold text-gray-900">For Talent</h3>
                            </div>

                            <div className="grid gap-8">
                                {jobSeekerFeatures.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-start space-x-6 group/item"
                                    >
                                        <div className="mt-1 flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-300">
                                            <feature.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover/item:text-blue-600 transition-colors">
                                                {feature.title}
                                            </h4>
                                            <p className="text-gray-500 leading-relaxed font-medium">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    
                    <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-white relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700 opacity-50" />

                        <div className="relative z-10">
                            <div className="flex items-center space-x-4 mb-12">
                                <div className="p-4 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-600/30">
                                    <Briefcase className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-extrabold text-gray-900">For Hiring</h3>
                            </div>

                            <div className="grid gap-8">
                                {employerFeatures.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-start space-x-6 group/item"
                                    >
                                        <div className="mt-1 flex-shrink-0 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover/item:bg-purple-600 group-hover/item:text-white transition-all duration-300">
                                            <feature.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover/item:text-purple-600 transition-colors">
                                                {feature.title}
                                            </h4>
                                            <p className="text-gray-500 leading-relaxed font-medium">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features
