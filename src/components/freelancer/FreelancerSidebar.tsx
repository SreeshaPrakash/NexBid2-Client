
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, FileText, CreditCard, LayoutDashboard, Send } from 'lucide-react';

const FreelancerSidebar: React.FC = () => {
    const navItems = [
        { path: '/FreelancerDashboard', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
        { path: '/freelancer/profile', icon: <Briefcase className="h-5 w-5" />, label: 'Profile' },
        { path: '/freelancer/bids', icon: <FileText className="h-5 w-5" />, label: 'Bids' },
        { path: '/freelancer/mybids', icon: <Send className="h-5 w-5" />, label: 'My Bids' },
        { path: '/freelancer/myprojects', icon: <Briefcase className="h-5 w-5" />, label: 'My Projects' },
        { path: '/freelancer/transactions', icon: <CreditCard className="h-5 w-5" />, label: 'Transactions' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] fixed left-0 top-[64px] overflow-y-auto hidden md:block z-10">
            <div className="p-6">
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                    isActive
                                        ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}

                    {/* Reserved Space for Upcoming */}
                    {/* <div className="px-4 py-3 mt-8 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Upcoming Features</p>
                        <div className="space-y-3 opacity-50 grayscale pointer-events-none">
                             <div className="flex items-center gap-3 px-2 py-2 text-slate-500 font-semibold">
                                <div className="h-5 w-5 rounded bg-slate-200"></div>
                                Messages
                            </div>
                            <div className="flex items-center gap-3 px-2 py-2 text-slate-500 font-semibold">
                                <div className="h-5 w-5 rounded bg-slate-200"></div>
                                Analytics
                            </div>
                        </div>
                    </div> */}
                </nav>
            </div>
        </aside>
    );
};

export default FreelancerSidebar;





