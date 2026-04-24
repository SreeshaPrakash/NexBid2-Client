import { NavLink } from 'react-router-dom';
import { User, Briefcase, LayoutDashboard } from 'lucide-react';
import { ProjectRoute, ClientRoute } from '../../constants/routeConstansts';

const ClientSidebar: React.FC = () => {
    const navItems = [
        { path: ClientRoute.HOME, icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
        { path: ClientRoute.PROFILE, icon: <User className="h-5 w-5" />, label: 'Profile' },
        { path: ProjectRoute.MY_PROJECTS, icon: <Briefcase className="h-5 w-5" />, label: 'Projects' },
        // { path: ClientRoute.BIDS, icon: <FileText className="h-5 w-5" />, label: 'Bids' },
        // { path: ClientRoute.MESSAGES, icon: <MessageSquare className="h-5 w-5" />, label: 'Messages' },
        // { path: ClientRoute.SETTINGS, icon: <Settings className="h-5 w-5" />, label: 'Settings' },
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
                </nav>
            </div>
        </aside>
    );
};

export default ClientSidebar;
