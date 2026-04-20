import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import {
    PlusCircle,
    Briefcase,
    Users,
    IndianRupee,
    TrendingUp,
    Clock,
    ArrowRight,
    BarChart2,
    Star
} from 'lucide-react';
import ClientSidebar from './ClientSidebar';
import { ProjectRoute } from '../../constants/routeConstansts';
import { getDashboardStats } from '../../services/clientService';
import { getClientProjects } from '../../services/projectService';
import type { ProjectDTO } from '../../types/project.dto';
import { ProjectStatus } from '../../constants/projectConstants';

const ClientDashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [dashboardData, setDashboardData] = React.useState<{ activeProjectsCount: number, totalBidsCount: number } | null>(null);
    const [recentProjects, setRecentProjects] = React.useState<ProjectDTO[]>([]);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, projects] = await Promise.all([
                    getDashboardStats(),
                    getClientProjects()
                ]);
                
                if (statsRes.success) {
                    setDashboardData(statsRes.data);
                }
                
                if (Array.isArray(projects)) {
                    // Sort by date and take top 3
                    const sorted = [...projects].sort((a, b) => 
                        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                    ).slice(0, 3);
                    setRecentProjects(sorted);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        {
            label: 'Active Projects',
            value: dashboardData?.activeProjectsCount.toString() || '0',
            icon: Briefcase,
            trend: '+1 this week',
            trendUp: true,
            gradient: 'from-emerald-500/20 to-teal-500/10',
            border: 'border-emerald-500/20',
            iconColor: 'text-emerald-400',
            iconBg: 'bg-emerald-500/10',
        },
        {
            label: 'Total Bids',
            value: dashboardData?.totalBidsCount.toString() || '0',
            icon: Users,
            trend: 'Across all projects',
            trendUp: false,
            gradient: 'from-blue-500/20 to-indigo-500/10',
            border: 'border-blue-500/20',
            iconColor: 'text-blue-400',
            iconBg: 'bg-blue-500/10',
        },
        {
            label: 'Hired Talents',
            value: '5',
            icon: Star,
            trend: 'Currently active',
            trendUp: false,
            gradient: 'from-purple-500/20 to-pink-500/10',
            border: 'border-purple-500/20',
            iconColor: 'text-purple-400',
            iconBg: 'bg-purple-500/10',
        },
        {
            label: 'Total Spent',
            value: '₹12,500',
            icon: IndianRupee,
            trend: 'Lifetime spend',
            trendUp: false,
            gradient: 'from-amber-500/20 to-orange-500/10',
            border: 'border-amber-500/20',
            iconColor: 'text-amber-400',
            iconBg: 'bg-amber-500/10',
        },
    ];

    const getStatusStyle = (status: string) => {
        const upperStatus = status.toUpperCase();
        switch (upperStatus) {
            case ProjectStatus.OPEN:
            case 'ACTIVE': return { dot: 'bg-emerald-400', pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
            case 'REVIEWING': return { dot: 'bg-amber-400', pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
            case ProjectStatus.COMPLETED: return { dot: 'bg-blue-400', pill: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
            default: return { dot: 'bg-white/30', pill: 'bg-white/5 text-white/40 border-white/10' };
        }
    };

    return (
        <div
            className="flex min-h-screen"
            style={{ fontFamily: "'DM Sans', sans-serif", background: '#08080C' }}
        >
            <ClientSidebar />

            <div className="flex-1 md:ml-64 px-6 py-10 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Client Dashboard</p>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                            Welcome back,{' '}
                            <span
                                className="bg-clip-text text-transparent"
                                style={{ backgroundImage: 'linear-gradient(90deg, #6EE7B7, #3B82F6)' }}
                            >
                                {user?.name || 'Client'}
                            </span>
                            !
                        </h1>
                        <p className="text-white/40 text-base font-medium">
                            Here's an overview of your projects and activity.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button className="h-11 px-5 rounded-xl bg-white/5 border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
                            <BarChart2 className="h-4 w-4" />
                            Analytics
                        </button>
                        <Link to={ProjectRoute.CREATE}>
                            <button
                                className="h-11 px-5 rounded-xl text-black font-bold text-sm flex items-center gap-2 shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)', boxShadow: '0 0 24px rgba(110,231,183,0.2)' }}
                            >
                                <PlusCircle className="h-4 w-4" />
                                Post a Project
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
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
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
                                    <h2 className="text-base font-bold text-white">Recent Projects</h2>
                                    <p className="text-xs text-white/30 mt-0.5">Your latest postings</p>
                                </div>
                                <Link
                                    to={ProjectRoute.MY_PROJECTS}
                                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors group"
                                >
                                    View all <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>

                            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                {recentProjects.map((project) => {
                                    const status = project.projectStatus || ProjectStatus.OPEN;
                                    const s = getStatusStyle(status);
                                    return (
                                        <div key={project.id || project._id} className="px-6 py-5 hover:bg-white/[0.02] transition-colors group">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                            {project.title}
                                                        </h3>
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-widest ${s.pill}`}>
                                                            <span className={`inline-block h-1.5 w-1.5 rounded-full ${s.dot} ${status === ProjectStatus.OPEN ? 'animate-pulse' : ''}`} />
                                                            {status}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 text-xs text-white/35 font-medium">
                                                        <span className="flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5" />{project.budget}</span>
                                                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{new Date(project.createdAt || '').toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2.5 flex-shrink-0">
                                                    <Link to={`/projects/${project.id || project._id}/details`}>
                                                        <button className="h-9 px-4 text-xs font-bold uppercase tracking-wider text-white/60 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-all">
                                                            Manage
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div
                            className="rounded-2xl p-6"
                            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Client Resources</p>
                            <div className="space-y-1">
                                {[
                                    'How to write a perfect brief',
                                    'Navigating the payment system',
                                    'Hiring guide for developers',
                                ].map((item, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all group"
                                    >
                                        {item}
                                        <ArrowRight className="h-3.5 w-3.5 text-white/20 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
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

export default ClientDashboard;
