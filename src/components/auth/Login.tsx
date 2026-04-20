import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/auth/authSlice';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../../services/authService';
import { loginSchema, isValidEmailFormat } from '../../validations/zodSchemas';
import { UserRoute } from '../../constants/routeConstansts';

const Login: React.FC = () => { 
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

       
        if (!isValidEmailFormat(formData.email)) {
            toast.error("Invalid email format");
            return;
        }

        setLoading(true);

        try {
            const response = await loginUser({
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

                toast.success(response.message || "Logged in successfully!");
                navigate(UserRoute.HOME);
            } else {
                toast.error(response.message || "Login failed. Please check your credentials.");
            }
        } catch (error: any) {
            if (error.response) {
                const errorMessage = error.response.data?.message || "Invalid email or password";
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error("Network error. Please check your connection or try again later.");
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
            console.error("Login Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (tokenResponse: any) => {
        setLoading(true);
        console.log("Token Response from Google:", tokenResponse);
        try {
            const response = await googleLogin(tokenResponse.access_token);
            console.log("Response from Backend:", response);

            if (response.success && response.accessToken && response.user) {
                dispatch(setCredentials({
                    user: response.user,
                    accessToken: response.accessToken
                }));
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('user', JSON.stringify(response.user));
                toast.success(response.message || "Logged in with Google!");
                navigate(UserRoute.HOME);
            } else {
                toast.error(response.message || "Google login failed: " + (response.message || "Unknown error"));
            }
        } catch (error: any) {
            console.error("Google Login Error:", error);
            const errorMsg = error.response?.data?.message || error.message || "Google login failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: (error) => {
            console.error("useGoogleLogin Error:", error);
            toast.error("Google login failed");
        }
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorative blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]"></div>

            <div className="max-w-md w-full z-10">
                <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[2rem] shadow-2xl border border-white/20 relative overflow-hidden group">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600"></div>

                    <div className="relative text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="bg-indigo-600/10 p-4 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500">
                                <LogIn className="w-8 h-8 text-indigo-600" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-slate-500 font-medium">
                            Step into the future of bidding
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        <div className="space-y-4">
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors" />
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`appearance-none rounded-xl relative block w-full px-4 py-3.5 pl-11 border ${errors.email ? 'border-red-500' : 'border-slate-200'} bg-white/50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm font-medium`}
                                    placeholder="Email address"
                                />
                                {errors.email && <p className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-semibold">{errors.email}</p>}
                            </div>

                            <div className="relative group/input pt-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`appearance-none rounded-xl relative block w-full px-4 py-3.5 pl-11 pr-11 border ${errors.password ? 'border-red-500' : 'border-slate-200'} bg-white/50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm font-medium`}
                                    placeholder="Password"
                                />
                                {errors.password && <p className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-semibold">{errors.password}</p>}
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors"
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

                        <div className="flex items-center justify-end pt-1">
                            <Link to={UserRoute.FORGOT_PASSWORD} className="text-sm font-bold text-indigo-600 hover:text-violet-600 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <ArrowRight className="h-5 w-5 text-indigo-200 group-hover:translate-x-1 transition-transform" />
                                )}
                            </span>
                            {loading ? 'Sign-in Progress...' : 'Continue to NexBid'}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200/50"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest leading-none">
                                <span className="px-3 bg-white/0 text-slate-400">Secure Connect</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => loginWithGoogle()}
                            className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 shadow-sm text-sm font-bold rounded-xl text-slate-700 bg-white/50 hover:bg-white hover:border-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                        >
                            <svg className="h-5 w-5 mr-3" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                            </svg>
                            Google Account
                        </button>

                        <div className="text-center mt-8">
                            <p className="text-sm font-medium text-slate-500">
                                New to our community?{' '}
                                <Link to={UserRoute.SIGNUP} className="font-bold text-indigo-600 hover:text-violet-600 transition-colors underline decoration-indigo-200 hover:decoration-violet-600 underline-offset-4">
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
