import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const emailParam = searchParams.get('email');
        const otpParam = searchParams.get('otp');
        if (emailParam) {
            setEmail(emailParam);
        }
        if (otpParam) {
            setOtp(otpParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setLoading(true);
        try {
            const response = await resetPassword({
                email,
                otp,
                newPassword
            });
            toast.success(response.message || "Password reset successfully!");
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reset password. Please check your OTP.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-teal-50 via-gray-50 to-white">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-500"></div>

                <div className="relative text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-teal-100 p-3 rounded-full">
                            <ShieldCheck className="w-8 h-8 text-teal-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Set a strong new password for <span className="font-medium text-gray-900">{email}</span>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Email Field (Required for the reset service) */}
                        {/* <div className="relative group">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative text-left">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div> */}

                        {/* 6-Digit OTP Input */}
                        <div className="relative group">
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">6-Digit OTP Code</label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="appearance-none rounded-lg relative block w-full px-3 py-4 text-center text-2xl font-bold tracking-[0.5em] border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm"
                                placeholder="••••••"
                                maxLength={6}
                            />
                        </div>

                        <div className="relative group">
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <div className="relative text-left">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                </div>
                                <input
                                    id="new-password"
                                    name="new-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm"
                                    placeholder="Min. 8 characters"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
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

                        <div className="relative group">
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative text-left">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                </div>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm"
                                    placeholder="Repeat your password"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Updating Password...' : 'Reset Password'}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Back to{' '}
                        <Link to="/forgot-password" title="Go back to OTP step" className="font-medium text-teal-600 hover:text-teal-500 hover:underline">
                            Forgot Password
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
