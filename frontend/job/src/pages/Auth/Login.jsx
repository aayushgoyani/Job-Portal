import React, { useEffect } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPaths';

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "employer" ? "/employer-dashboard" : "/find-jobs");
    }
  }, [isAuthenticated, user, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
    role: ''
  });

  const [formState, setFormState] = useState({
    loading: false,
    error: {},
    showPassword: false,
    success: false
  });


  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };
  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    return '';
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));


    if (formState.error[name]) {
      setFormState(prev => ({
        ...prev,
        error: { ...prev.error, [name]: '' }
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
    if (formState.error.role) {
      setFormState(prev => ({
        ...prev,
        error: { ...prev.error, role: '' }
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role: !formData.role ? 'Please select a role' : ''
    };


    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });

    setFormState(prev => ({ ...prev, error: errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, loading: true }));

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        rememberMe: formData.remember,
      });

      const { token, role } = response.data;
      if (token) {
        login({ ...response.data, fullName: response.data.name }, token);
        setFormState(prev => ({
          ...prev,
          loading: false,
          success: true,
          error: {},
        }));
        toast.success('Signed in successfully!');
        setTimeout(() => {
          navigate(role === "employer" ? "/employer-dashboard" : "/find-jobs");
        }, 1500);
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        loading: false,
        error: {
          submit: error.response?.data?.message || 'Login failed. Please check your credentials.'
        }
      }));
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-4">You have been successfully logged in.</p>
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-500 mt-2">Redirecting to your dashboard.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden">

      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[100px] opacity-10 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-10 mx-auto"
          >
            <Briefcase className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-black text-white mb-6 leading-tight"
          >
            Welcome Back to
            <span className="block text-blue-500 mt-2">Success.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-xl font-medium leading-relaxed"
          >
            Log in to access your personalized dashboard and continue your professional journey.
          </motion.p>
        </div>
      </div>


      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
        <div className="w-full max-w-md">

          <div className="lg:hidden flex items-center space-x-3 mb-12 justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900">JobPortal</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-gray-900 mb-3">Sign In</h1>
            <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">To your professional portal</p>
          </div>

          {formState.error.submit && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 mb-8 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 font-bold"
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>{formState.error.submit}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-3">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Your Role</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange("jobseeker")}
                  className={`p-5 rounded-2xl border-2 transition-all group flex flex-col items-center text-center ${formData.role === "jobseeker"
                    ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-500/10"
                    : "border-gray-100 bg-white hover:border-blue-100"
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${formData.role === "jobseeker" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500"}`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div className="font-black text-gray-900 text-sm">Talent</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("employer")}
                  className={`p-5 rounded-2xl border-2 transition-all group flex flex-col items-center text-center ${formData.role === "employer"
                    ? "border-purple-600 bg-purple-50/50 shadow-lg shadow-purple-500/10"
                    : "border-gray-100 bg-white hover:border-purple-100"
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${formData.role === "employer" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-500"}`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="font-black text-gray-900 text-sm">Hiring</div>
                </button>
              </div>
              {formState.error.role && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1">{formState.error.role}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-14 pr-6 py-5 rounded-2xl bg-white border ${formState.error.email ? 'border-red-500' : 'border-gray-100'} group-hover:border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-gray-900 font-medium`}
                  placeholder="name@company.com"
                />
              </div>
              {formState.error.email && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1">{formState.error.email}</p>
              )}
            </div>


            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Password</label>
                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={formState.showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-14 pr-14 py-5 rounded-2xl bg-white border ${formState.error.password ? 'border-red-500' : 'border-gray-100'} group-hover:border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-gray-900 font-medium`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {formState.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formState.error.password && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1">{formState.error.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={formState.loading}
              className="w-full btn-gradient py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formState.loading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-gray-600 font-bold">
            New to JobPortal?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-600 font-black hover:text-blue-700 transition-colors"
            >
              Create an Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;