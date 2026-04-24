import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import { ProjectRoute } from '../../constants/routeConstansts';
import {
    Briefcase,
    Clock,
    CheckCircle,
    IndianRupee,
    Search,
    TrendingUp,
    ArrowRight
} from 'lucide-react';
import FreelancerSidebar from './FreelancerSidebar';
import { getDashboardStats } from '../../services/freelancerService';
import type { ProjectDTO } from '../../types/project.dto';

const FreelancerDashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [dashboardData, setDashboardData] = React.useState<{ totalBidsPlaced: number, ongoingProjectsCount: number, completedProjectsCount: number, totalEarnings: number, recommendedProjects: ProjectDTO[] } | null>(null);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await getDashboardStats();
                if (res.success) {
                    setDashboardData(res.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (amount: number): string => {
        return '₹' + amount.toLocaleString('en-IN');
    };

    const stats = [
        {
            label: 'Total Bids',
            value: dashboardData?.totalBidsPlaced.toString() || '0',
            icon: Clock,
            trend: 'Across all time',
            trendUp: false,
            border: 'border-blue-500/20',
            iconColor: 'text-blue-400',
            iconBg: 'bg-blue-500/10',
            gradient: 'from-blue-500/20 to-indigo-500/10',
        },
        {
            label: 'Ongoing Projects',
            value: dashboardData?.ongoingProjectsCount.toString() || '0',
            icon: Briefcase,
            trend: 'Due this month',
            trendUp: true,
            border: 'border-indigo-500/20',
            iconColor: 'text-indigo-400',
            iconBg: 'bg-indigo-500/10',
            gradient: 'from-indigo-500/20 to-purple-500/10',
        },
        {
            label: 'Completed',
            value: dashboardData?.completedProjectsCount.toString() || '0',
            icon: CheckCircle,
            trend: 'All time',
            trendUp: false,
            border: 'border-emerald-500/20',
            iconColor: 'text-emerald-400',
            iconBg: 'bg-emerald-500/10',
            gradient: 'from-emerald-500/20 to-teal-500/10',
        },
        {
            label: 'Total Earnings',
            value: formatCurrency(dashboardData?.totalEarnings || 0),
            icon: IndianRupee,
            trend: 'Lifetime earnings',
            trendUp: false,
            border: 'border-amber-500/20',
            iconColor: 'text-amber-400',
            iconBg: 'bg-amber-500/10',
            gradient: 'from-amber-500/20 to-orange-500/10',
        },
    ];

    const recommendedProjects = dashboardData?.recommendedProjects || [];

    return (
        <div
            className="flex min-h-screen"
            style={{ fontFamily: "'DM Sans', sans-serif", background: '#08080C' }}
        >
            <FreelancerSidebar />

            <div className="flex-1 md:ml-64 px-6 py-10 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Freelancer Dashboard</p>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                            Welcome back,{' '}
                            <span
                                className="bg-clip-text text-transparent"
                                style={{ backgroundImage: 'linear-gradient(90deg, #818CF8, #3B82F6)' }}
                            >
                                {user?.name || 'Freelancer'}
                            </span>
                            !
                        </h1>
                        <p className="text-white/40 text-base font-medium">
                            Here's your activity overview for today.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Link to={ProjectRoute.OPEN_PROJECTS}>
                            <button
                                className="h-11 px-5 rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg, #818CF8 0%, #3B82F6 100%)', boxShadow: '0 0 24px rgba(129,140,248,0.25)' }}
                            >
                                <Search className="h-4 w-4" />
                                Find Projects
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={i}
                                className={`relative rounded-2xl border ${stat.border} p-6 group hover:border-white/20 transition-all duration-300 overflow-hidden`}
                                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(14px)' }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative flex items-start justify-between mb-4">
                                    <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                                        <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                                    </div>
                                    {stat.trendUp && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                                            <TrendingUp className="h-3 w-3" /> Up
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <p className="text-3xl font-extrabold text-white leading-none mb-1">{stat.value}</p>
                                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-xs text-white/25 mt-2">{stat.trend}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                    <div className="lg:col-span-2">
                        <div
                            className="rounded-2xl border border-white/10 overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(12px)' }}
                        >
                            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <div>
                                    <h2 className="text-base font-bold text-white">Recommended for You</h2>
                                    <p className="text-xs text-white/30 mt-0.5">Matched to your skills</p>
                                </div>
                                <Link
                                    to={ProjectRoute.OPEN_PROJECTS}
                                    className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-widest"
                                >
                                    Browse All
                                </Link>
                            </div>

                            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                {recommendedProjects.length > 0 ? (
                                    recommendedProjects.map((project) => (
                                        <div key={project.id || project._id} className="px-6 py-5 hover:bg-white/[0.02] transition-colors group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="space-y-1">
                                                    <Link to={`/projects/${project.id || project._id}/details`}>
                                                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors cursor-pointer">
                                                            {project.title}
                                                        </h3>
                                                    </Link>
                                                    <div className="flex items-center gap-4 text-xs text-white/35 font-medium">
                                                        <span className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                                                            <Briefcase className="h-3.5 w-3.5" /> Project ID: {(project.id || project._id || '').substring(0, 8)}...
                                                        </span>
                                                        <span>{new Date(project.updatedAt || '').toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0 ml-4">
                                                    <div className="text-sm font-bold text-white">₹{project.budget}</div>
                                                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Budget</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {project.skillsRequired?.map((tag) => (
                                                        <span key={tag} className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <Link to={`/projects/${project.id || project._id}/details`}>
                                                    <button className="h-8 px-4 rounded-lg text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all flex-shrink-0 ml-3">
                                                        Apply
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-10 text-center text-white/30 italic">
                                        No recommended projects found. Try updating your skills in profile.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div
                            className="rounded-2xl p-6"
                            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Quick Links</p>
                            <div className="space-y-1">
                                {[
                                    'Tips to win more bids',
                                    'Payment & withdrawal guide',
                                    'How to build a great portfolio',
                                ].map((item, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all group"
                                    >
                                        {item}
                                        <ArrowRight className="h-3.5 w-3.5 text-white/20 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreelancerDashboard;
