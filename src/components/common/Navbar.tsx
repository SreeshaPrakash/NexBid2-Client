import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import { logout, setActiveRole } from '../../redux/slices/auth/authSlice';
import { switchRole as switchRoleApi } from '../../services/authService';
import { Menu, X, Briefcase, User, LogOut, Home, ArrowLeftRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);
    const { user, activeRole } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('activeRole');
        navigate('/');
        setIsProfileOpen(false);
    };

    const handleSwitchRole = async () => {
        if (!user) return;

        setIsSwitching(true);
        const nextRole = activeRole === 'client' ? 'freelancer' : 'client';

        try {
            const response = await switchRoleApi(nextRole);
            if (response.success) {
                const { hasProfile, accessToken } = response.data;
                dispatch(setActiveRole({
                    role: nextRole,
                    hasProfile,
                    accessToken
                }));
                toast.success(`Switched to ${nextRole.toLowerCase()} role`);
                setIsProfileOpen(false);
                setIsMenuOpen(false);

                // Redirect logic based on profile existence
                if (nextRole === 'freelancer' && hasProfile === false) {
                    navigate('/freelancer/setup-profile');
                } else {
                    navigate('/home');
                }
            } else {
                toast.error(response.message || 'Failed to switch role');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error switching role');
            console.error('Role switch error:', error);
        } finally {
            setIsSwitching(false);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'How It Works', path: '/#how-it-works' },
        { name: 'Categories', path: '/#categories' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const buttonBase = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const buttonSm = "h-8 px-3 text-sm";
    const buttonPrimary = "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500";
    const buttonOutline = "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-teal-500";

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to={user ? "/home" : "/"} className="flex-shrink-0 flex items-center">
                            <span className="bg-teal-600 p-1.5 rounded-lg mr-2">
                                <Briefcase className="h-6 w-6 text-white" />
                            </span>
                            <span className="font-bold text-xl text-gray-900">NexBid</span>
                        </Link>

                        {user && (
                            <div className="ml-4 hidden sm:flex items-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${activeRole === 'freelancer'
                                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                                    : 'bg-teal-100 text-teal-800 border-teal-200'
                                    }`}>
                                    <Shield className="w-3 h-3 mr-1" />
                                    {activeRole}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {!user && navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}

                        {user ? (
                            <div className="flex items-center space-x-4 ml-4">
                                <Link to="/home">
                                    <button className={`${buttonBase} ${buttonOutline} ${buttonSm} flex items-center gap-2`}>
                                        <Home className="h-4 w-4" />
                                        Dashboard
                                    </button>
                                </Link>

                                {/* User Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors"
                                    >
                                        <div className="bg-teal-100 p-2 rounded-full">
                                            <User className="h-4 w-4 text-teal-600" />
                                        </div>
                                        <span className="font-medium">{user.name}</span>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    My Profile
                                                </div>
                                            </Link>
                                            <button
                                                onClick={handleSwitchRole}
                                                disabled={isSwitching}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ArrowLeftRight className={`h-4 w-4 ${isSwitching ? 'animate-spin' : ''}`} />
                                                    Switch to {activeRole === 'client' ? 'Freelancer' : 'Client'}
                                                </div>
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <LogOut className="h-4 w-4" />
                                                    Logout
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4 ml-4">
                                <Link to="/login">
                                    <button className={`${buttonBase} ${buttonOutline} ${buttonSm}`}>Log In</button>
                                </Link>
                                <Link to="/signup">
                                    <button className={`${buttonBase} ${buttonPrimary} ${buttonSm}`}>Sign Up</button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    {!user && (
                        <div className="pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    )}

                    <div className="pt-4 pb-4 border-t border-gray-200">
                        {user ? (
                            <div className="px-5 space-y-3">
                                <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-teal-100 p-2 rounded-full">
                                            <User className="h-5 w-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 truncate max-w-[150px]">{user.name}</p>
                                            <p className="text-sm text-gray-500 truncate max-w-[150px]">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${activeRole === 'freelancer'
                                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                                        : 'bg-teal-100 text-teal-800 border-teal-200'
                                        }`}>
                                        {activeRole}
                                    </span>
                                </div>
                                <Link to="/home" className="w-full" onClick={() => setIsMenuOpen(false)}>
                                    <button className={`${buttonBase} ${buttonOutline} ${buttonSm} w-full justify-start gap-2`}>
                                        <Home className="h-4 w-4" />
                                        Dashboard
                                    </button>
                                </Link>

                                <button
                                    onClick={handleSwitchRole}
                                    disabled={isSwitching}
                                    className={`${buttonBase} ${buttonOutline} ${buttonSm} w-full justify-start gap-2 disabled:opacity-50`}
                                >
                                    <ArrowLeftRight className={`h-4 w-4 ${isSwitching ? 'animate-spin' : ''}`} />
                                    Switch to {activeRole === 'client' ? 'Freelancer' : 'Client'}
                                </button>

                                <Link to="/profile" className="w-full" onClick={() => setIsMenuOpen(false)}>
                                    <button className={`${buttonBase} ${buttonOutline} ${buttonSm} w-full justify-start gap-2`}>
                                        <User className="h-4 w-4" />
                                        My Profile
                                    </button>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center px-5 space-x-4">
                                <Link to="/login" className="w-full">
                                    <button className={`${buttonBase} ${buttonOutline} ${buttonSm} w-full`}>Log In</button>
                                </Link>
                                <Link to="/signup" className="w-full">
                                    <button className={`${buttonBase} ${buttonPrimary} ${buttonSm} w-full`}>Sign Up</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

