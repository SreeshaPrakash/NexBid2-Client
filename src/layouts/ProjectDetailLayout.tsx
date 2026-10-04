import React from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { Info, FileText } from 'lucide-react';

const ProjectDetailLayout: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();

    const navItems = [
        { 
            name: 'Details', 
            path: `/projects/${projectId}/details`, 
            icon: <Info className="h-4 w-4" /> 
        },
        { 
            name: 'Proposals', 
            path: `/projects/${projectId}/proposals`, 
            icon: <FileText className="h-4 w-4" /> 
        },
    ];

    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tab Navigation */}
                <div className="flex items-center gap-1 p-1 bg-[#111118] rounded-2xl border border-white/5 mb-8 w-fit">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    isActive
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }`
                            }
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                {/* Content Area */}
                <div className="transition-all duration-300">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailLayout;
