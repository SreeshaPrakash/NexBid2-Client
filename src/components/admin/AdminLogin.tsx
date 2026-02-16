import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/adminService';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/auth/authSlice';
import toast from 'react-hot-toast';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await adminLogin({
                email: formData.email,
                password: formData.password
            });

            if (response.success && response.accessToken && response.user) {
                dispatch(setCredentials({
                    user: response.user,
                    accessToken: response.accessToken
                }));

                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('user', JSON.stringify(response.user));

                toast.success("Admin access granted");
                navigate('/dashboard');
            } else {
                toast.error(response.message || "Access denied");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid administrative credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Cyberpunk background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
            </div>

            <div className="max-w-md w-full space-y-8 bg-[#16161a] p-10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 relative z-10 transition-all hover:border-blue-500/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>

                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-600/10 p-4 rounded-xl border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                            <ShieldCheck className="w-10 h-10 text-blue-500" />
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-xs font-mono text-blue-500/60 uppercase tracking-[0.3em] mb-2">
                        <Terminal className="w-3 h-3" />
                        <span>Secure Admin Portal</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                        NexBid Management
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Authorized Personnel Only
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 bg-[#1c1c21] border border-white/5 placeholder-gray-600 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                placeholder="Admin Identifier"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 pr-10 bg-[#1c1c21] border border-white/5 placeholder-gray-600 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                placeholder="Security Key"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-blue-400 focus:outline-none transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#16161a] focus:ring-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Authenticating System...' : 'Establish Connection'}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                        Protocol IP-77 SECURED
                    </p>
                </div>
            </div>

            {/* Terminal scanline effect overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-0 bg-[length:100%_2px,3px_100%]"></div>
        </div>
    );
};

export default AdminLogin;
