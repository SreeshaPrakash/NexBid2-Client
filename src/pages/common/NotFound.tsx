import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Animated Ghost Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <Ghost size={80} className="text-blue-600 animate-bounce" />
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <div className="space-y-2">
          <h1 className="text-9xl font-black text-slate-200 tracking-tighter">404</h1>
          <h2 className="text-3xl font-bold text-slate-900">Oops! Page not found</h2>
          <p className="text-slate-500 max-w-xs mx-auto">
            The page you're looking for doesn't exist or has been moved to another universe.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all duration-200"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Home size={18} />
            Home
          </button>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
