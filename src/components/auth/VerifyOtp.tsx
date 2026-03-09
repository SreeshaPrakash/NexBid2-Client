import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../../services/authService';
import { resetPasswordSchema } from '../../validations/zodSchemas';
import toast from 'react-hot-toast';

const VerifyOtp: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else if (location.state?.purpose === 'reset') {
            toast.error("Email not found. Please try again.");
            navigate('/forgot-password');
        } else {
            toast.error("Email not found. Please sign up or login again.");
            navigate('/signup');
        }
    }, [location, navigate]);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        if (element.nextSibling && element.value !== "") {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && otp[index] === "" && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
            const prevInput = (e.currentTarget.previousSibling as HTMLInputElement);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const data = e.clipboardData.getData("text");
        if (!/^\d{6}$/.test(data)) return;
        const curOtp = data.split("");
        setOtp(curOtp);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        const otpValue = otp.join("");

        const result = resetPasswordSchema.pick({ otp: true }).safeParse({ otp: otpValue });
        if (!result.success) {
            setErrors({ otp: result.error.issues[0].message });
            return;
        }

        setLoading(true);
        try {
            const response = await verifyOtp(email, otpValue);
            if (response.success) {
                toast.success(response.message || "Email verified successfully!");
                navigate('/login');
            } else {
                toast.error(response.message || "Verification failed");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        try {
            const response = await resendOtp(email);
            toast.success(response.message || "OTP resent successfully");
            setResendCooldown(60); // 60 seconds cooldown
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-50 via-gray-50 to-white">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-500"></div>

                <div className="relative">
                    <div className="flex justify-center mb-6">
                        <div className="bg-teal-100 p-3 rounded-full">
                            <ShieldCheck className="w-8 h-8 text-teal-600" />
                        </div>
                    </div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                        Verify your email
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We sent a code to <span className="font-medium text-gray-900">{email}</span>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex justify-center gap-2">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    name="otp"
                                    maxLength={1}
                                    value={data}
                                    onChange={(e) => {
                                        handleChange(e.target, index);
                                        if (errors.otp) setErrors({});
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className={`w-12 h-14 text-center text-2xl font-extrabold text-gray-900 bg-gray-50 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all shadow-sm`}
                                />
                            ))}
                        </div>
                        {errors.otp && <p className="text-xs text-red-500 font-medium">{errors.otp}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <ArrowRight className="h-5 w-5 text-teal-100 group-hover:text-white transition-colors" />
                                )}
                            </span>
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendCooldown > 0}
                                className={`font-medium text-teal-600 hover:text-teal-500 hover:underline focus:outline-none ${resendCooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;
