import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import { resetPasswordSchema, isPasswordComplex } from '../../validations/zodSchemas';
import toast from 'react-hot-toast';
import { UserRoute } from '../../constants/routeConstansts';


const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // Extract email and otp from location state passed from VerifyOtp page
        const state = location.state as { email?: string; otp?: string } | null;
        const { email: stateEmail, otp: stateOtp } = state || {};

        if (stateEmail) {
            setEmail(stateEmail);
            if (stateOtp) setOtp(stateOtp);
        } else {
            // If someone navigates here directly without Email, send them back
            toast.error("Session expired or invalid. Please try again.");
            navigate(`/${UserRoute.FORGOT_PASSWORD}`);
        }
    }, [location.state, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // 1. Mandatory Field Validations (under the fields)
        const result = resetPasswordSchema.safeParse({ otp, newPassword, confirmPassword });
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

        // 2. Format & Logical Validations (Toasters)
        if (!isPasswordComplex(newPassword)) {
            toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
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
            navigate(`/${UserRoute.LOGIN}`);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to reset password. Please check your OTP.");
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
                        Update Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter the OTP sent to <span className="font-medium text-gray-900">{email}</span> and set your new password.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4">
                        <div className="text-center py-2 bg-teal-50 rounded-lg mb-6 border border-teal-100">
                            <p className="text-xs text-teal-700 font-medium italic">
                                Step 3 of 3: Finalize New Password
                            </p>
                        </div>

                        <div className="relative group">
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                            <div className="relative text-left">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <ShieldCheck className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                </div>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value);
                                        if (errors.otp) setErrors(prev => ({ ...prev, otp: '' }));
                                    }}
                                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 pr-10 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm`}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                />
                                {errors.otp && <p className="mt-1 text-xs text-red-500 font-medium">{errors.otp}</p>}
                            </div>
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
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
                                    }}
                                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 pr-10 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm`}
                                    placeholder="Min. 8 characters"
                                />
                                {errors.newPassword && <p className="mt-1 text-xs text-red-500 font-medium">{errors.newPassword}</p>}
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
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                                    }}
                                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 pr-10 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm`}
                                    placeholder="Repeat your password"
                                />
                                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
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
                        <Link to={`/${UserRoute.FORGOT_PASSWORD}`} title="Go back to OTP step" className="font-medium text-teal-600 hover:text-teal-500 hover:underline">
                            Forgot Password
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
