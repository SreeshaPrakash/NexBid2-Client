import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/adminService';
import { useDispatch } from 'react-redux';
import { setAdminCredentials } from '../../redux/slices/admin/adminAuthSlice';
import toast from 'react-hot-toast';
import { loginSchema } from '../../validations/zodSchemas';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // to clear fields when user starts typing
        if (errors[e.target.name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // 1. Zod Validation
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: { [key: string]: string } = {};
            result.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    fieldErrors[issue.path[0] as string] = issue.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        setLoading(true);

        try {
            const response = await adminLogin({
                email: formData.email,
                password: formData.password
            });

            if (response.success && response.accessToken && response.user) {
                dispatch(setAdminCredentials({
                    user: response.user,
                    accessToken: response.accessToken
                }));

                toast.success("Welcome back, Admin");
                navigate('/admin/dashboard');
            } else {
                toast.error(response.message || "Access denied");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="max-w-md w-full z-10 transition-all duration-500">
                <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-white/20 overflow-hidden group">
                    {/* Top indicator bar */}
                    <div className="h-2 bg-gradient-to-r from-indigo-600 via-rose-500 to-indigo-600"></div>
                    
                    <div className="px-10 py-12">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/10 rounded-2xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                <Lock className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admin Portal</h2>
                            <p className="text-slate-500 font-semibold mt-3 uppercase tracking-[0.15em] text-[10px]">Secure Infrastructure Access</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                            <div className="space-y-4">
                                <div className="group/input relative">
                                    <label htmlFor="email" className="block text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-300 group-focus-within/input:text-indigo-600 transition-colors" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`block w-full pl-11 pr-4 py-3.5 bg-white/50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm font-medium text-slate-900`}
                                            placeholder="admin@nexbid.com"
                                        />
                                    </div>
                                    {errors.email && <p className="mt-2 text-[10px] text-red-500 font-bold ml-1">{errors.email}</p>}
                                </div>

                                <div className="group/input relative">
                                    <label htmlFor="password" className="block text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-300 group-focus-within/input:text-indigo-600 transition-colors" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`block w-full pl-11 pr-11 py-3.5 bg-white/50 border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm font-medium text-slate-900`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-indigo-600 transition-colors focus:outline-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-2 text-[10px] text-red-500 font-bold ml-1">{errors.password}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full relative py-4 px-6 rounded-2xl font-black text-sm text-white uppercase tracking-widest bg-slate-900 hover:bg-black shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.4)] transition-all duration-300 transform active:scale-[0.98] mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Authorizing...
                                    </span>
                                ) : 'Enter Portal'}
                            </button>
                        </form>
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Authorized Personnel Only • Environment: Production</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;



