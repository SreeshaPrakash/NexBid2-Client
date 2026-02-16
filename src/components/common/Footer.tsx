import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Briefcase } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center mb-4">
                            <span className="bg-teal-600 p-1.5 rounded-lg mr-2">
                                <Briefcase className="h-5 w-5 text-white" />
                            </span>
                            <span className="font-bold text-xl text-gray-900">NexBid</span>
                        </Link>
                        <p className="text-gray-500 text-sm mb-4">
                            Connect with skilled freelancers globally for projects, big or small. Your next success story starts here.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Platform</h3>
                        <ul className="space-y-3">
                            <li><Link to="/find-work" className="text-gray-500 hover:text-teal-600 text-sm">Find Work</Link></li>
                            <li><Link to="/find-talent" className="text-gray-500 hover:text-teal-600 text-sm">Find Talent</Link></li>
                            <li><Link to="/categories" className="text-gray-500 hover:text-teal-600 text-sm">Categories</Link></li>
                            <li><Link to="/about" className="text-gray-500 hover:text-teal-600 text-sm">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li><Link to="/help" className="text-gray-500 hover:text-teal-600 text-sm">Help & Support</Link></li>
                            <li><Link to="/trust" className="text-gray-500 hover:text-teal-600 text-sm">Trust & Safety</Link></li>
                            <li><Link to="/terms" className="text-gray-500 hover:text-teal-600 text-sm">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="text-gray-500 hover:text-teal-600 text-sm">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-teal-600"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-teal-600"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-teal-600"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-teal-600"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center bg-white">
                    <p className="text-gray-400 text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} NexBid. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
