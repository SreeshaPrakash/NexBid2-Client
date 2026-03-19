import React, { useState } from 'react';
import { Mail, ArrowRight, KeyRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../services/authService';
import { forgotPasswordSchema } from '../../validations/zodSchemas';
import toast from 'react-hot-toast';
import { UserRoute } from '../../constants/routeConstansts';


const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors({});
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        //mandatory fields validation
        const result = forgotPasswordSchema.safeParse({ email });
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
            await forgotPassword(email);
            toast.success("OTP sent to your email");
            navigate(`/${UserRoute.RESET_PASSWORD}`, { state: { email } });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50 via-gray-50 to-white">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-500"></div>

                <div className="relative text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-teal-100 p-3 rounded-full">
                            <KeyRound className="w-8 h-8 text-teal-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Forgot Password?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your email to receive a verification OTP to reset your password.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={handleChange}
                                className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border ${errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm`}
                                placeholder="Enter your registered email"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link to={`/${UserRoute.LOGIN}`} className="font-medium text-teal-600 hover:text-teal-500 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
