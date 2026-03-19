import React from 'react';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-red-100 rounded-full">
                        <ShieldAlert className="h-12 w-12 text-red-600" />
                    </div>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-lg text-gray-600 mb-8">
                    You don't have permission to access this page. Please contact your administrator if you believe this is an error.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-200"
                    >
                        <Home className="h-5 w-5" />
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
