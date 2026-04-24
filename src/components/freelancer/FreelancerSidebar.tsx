import { NavLink, useNavigate } from 'react-router-dom';
import { User, Briefcase, LayoutDashboard, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { logout as logoutAction } from '../../redux/slices/auth/authSlice';
import { logout as logoutApi } from '../../services/authService';
import toast from 'react-hot-toast';
import { ProjectRoute, UserRoute, FreelancerRoute } from '../../constants/routeConstansts';

const FreelancerSidebar: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const navItems = [
        { path: UserRoute.HOME, icon: LayoutDashboard, label: 'Dashboard' },
        { path: FreelancerRoute.PROFILE, icon: User, label: 'My Profile' },
        // { path: '/freelancer/mybids', icon: Send, label: 'My Bids' },
        { path: ProjectRoute.OPEN_PROJECTS, icon: Briefcase, label: 'Open Projects' },
        // { path: '/freelancer/transactions', icon: CreditCard, label: 'Transactions' },
    ];

    const handleLogout = async () => {
        try {
            await logoutApi();
        } catch {
            // Ignore API failure and proceed with local logout
        }
        dispatch(logoutAction());
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('activeRole');
        navigate(UserRoute.LANDING);
        toast.success('Logged out successfully');
    };

    return (
        <aside
            className="w-64 fixed left-0 top-[64px] bottom-0 overflow-y-auto hidden md:flex flex-col z-10"
            style={{
                background: '#0A0A0F',
                borderRight: '1px solid rgba(255,255,255,0.05)',
            }}
        >
            <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold text-black flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #818CF8 0%, #3B82F6 100%)' }}
                    >
                        {user?.name?.charAt(0).toUpperCase() || 'F'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user?.name || 'Freelancer'}</p>
                        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Freelancer</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] px-3 mb-3">Menu</p>
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                isActive
                                    ? 'text-white'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`
                        }
                        style={({ isActive }) =>
                            isActive
                                ? {
                                    background: 'rgba(129,140,248,0.1)',
                                    borderLeft: '2px solid #818CF8',
                                    paddingLeft: '10px',
                                }
                                : {}
                        }
                    >
                        <Icon style={{ width: 18, height: 18 }} className="flex-shrink-0" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="px-3 pb-6 space-y-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)', paddingTop: 16 }}>
                {/* <NavLink
                    to="/freelancer/profile/edit"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/5 transition-all"
                >
                    <Settings style={{ width: 18, height: 18 }} className="flex-shrink-0" />
                    Settings
                </NavLink> */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all"
                >
                    <LogOut style={{ width: 18, height: 18 }} className="flex-shrink-0" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default FreelancerSidebar;
