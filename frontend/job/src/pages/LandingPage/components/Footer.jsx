import { Briefcase, ArrowRight } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-24 pb-12 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">JobPortal</span>
                        </div>
                        <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                            The world's most trusted recruitment platform. Connecting talent with industry leaders worldwide.
                        </p>
                        <div className="flex space-x-4">
                            
                        </div>
                    </div>

                    
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-widest text-xs">Product</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Find Jobs</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Browse Companies</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Salary Estimator</a></li>
                        </ul>
                    </div>

                    
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-widest text-xs">Resources</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Career Advice</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Community</a></li>
                        </ul>
                    </div>

                    
                    <div className="space-y-6">
                        <h4 className="text-gray-900 font-bold uppercase tracking-widest text-xs">Get Updates</h4>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="name@company.com"
                                className="w-full pl-4 pr-12 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            />
                            <button className="absolute right-2 top-2 bottom-2 px-4 bg-gray-900 text-white rounded-xl hover:bg-blue-600 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                
                <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center">
                    <p className="text-gray-400 font-medium text-sm">
                        © {new Date().getFullYear()} JobPortal. All rights reserved.
                    </p>
                    <div className="flex space-x-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <a href="#" className="hover:text-gray-900">Privacy</a>
                        <a href="#" className="hover:text-gray-900">Terms</a>
                        <a href="#" className="hover:text-gray-900">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer