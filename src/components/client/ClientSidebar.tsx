import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Briefcase, FileText, LayoutDashboard } from 'lucide-react';

const ClientSidebar: React.FC = () => {
    const navItems = [
        { path: '/home', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
        { path: '/client/profile', icon: <User className="h-5 w-5" />, label: 'Profile' },
        { path: '/client/projects', icon: <Briefcase className="h-5 w-5" />, label: 'Projects' },
        { path: '/client/bids', icon: <FileText className="h-5 w-5" />, label: 'Bids' },
    ];

    return (
        <aside className="w-64 bg-[#0B0B0F] border-r border-white/5 min-h-[calc(100vh-64px)] fixed left-0 top-[64px] overflow-y-auto hidden md:block z-10">
            <div className="p-6">
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${isActive
                                    ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
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
                                Billings
                            </div>
                        </div>
                    </div> */}
                </nav>
            </div>
        </aside>
    );
};

export default ClientSidebar;
