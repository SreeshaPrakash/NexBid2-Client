import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import {
    Briefcase,
    Clock,
    CheckCircle,
    DollarSign,
    Search,
    ChevronRight,
    Star,
    TrendingUp,
    ArrowRight,
    Zap
} from 'lucide-react';
import FreelancerSidebar from './FreelancerSidebar';

const FreelancerDashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    const stats = [
        {
            label: 'Active Bids',
            value: '12',
            icon: Clock,
            trend: '3 pending review',
            trendUp: false,
            border: 'border-blue-500/20',
            iconColor: 'text-blue-400',
            iconBg: 'bg-blue-500/10',
            gradient: 'from-blue-500/20 to-indigo-500/10',
        },
        {
            label: 'Ongoing Projects',
            value: '3',
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
            value: '24',
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
            value: '₹1,24,500',
            icon: DollarSign,
            trend: 'Lifetime earnings',
            trendUp: false,
            border: 'border-amber-500/20',
            iconColor: 'text-amber-400',
            iconBg: 'bg-amber-500/10',
            gradient: 'from-amber-500/20 to-orange-500/10',
        },
    ];

    const recommendedProjects = [
        {
            id: '1',
            title: 'Modern E-commerce Website',
            client: 'TechCorp Solutions',
            budget: '₹45,000 - ₹60,000',
            posted: '2 hours ago',
            tags: ['React', 'Node.js', 'Tailwind'],
            rating: 4.8,
        },
        {
            id: '2',
            title: 'Mobile App UI/UX Design',
            client: 'Creative Studio',
            budget: '₹25,000 - ₹35,000',
            posted: '5 hours ago',
            tags: ['Figma', 'UI Design', 'Mobile'],
            rating: 4.9,
        },
        {
            id: '3',
            title: 'Backend API Development',
            client: 'StartupX',
            budget: '₹30,000 - ₹50,000',
            posted: '1 day ago',
            tags: ['Node.js', 'MongoDB', 'REST'],
            rating: 4.7,
        },
    ];

    return (
        <div
            className="flex min-h-screen"
            style={{ fontFamily: "'DM Sans', sans-serif", background: '#08080C' }}
        >
            {/* Sidebar */}
            <FreelancerSidebar />

            {/* Main content */}
            <div className="flex-1 md:ml-64 px-6 py-10 space-y-10">

                {/* Header */}
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
                        <button className="h-11 px-5 rounded-xl bg-white/5 border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
                            My Bids
                        </button>
                        <button
                            className="h-11 px-5 rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
                            style={{ background: 'linear-gradient(135deg, #818CF8 0%, #3B82F6 100%)', boxShadow: '0 0 24px rgba(129,140,248,0.25)' }}
                        >
                            <Search className="h-4 w-4" />
                            Find Projects
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
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

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

                    {/* Recommended Projects */}
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
                                <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors group">
                                    Browse All <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>

                            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                {recommendedProjects.map((project) => (
                                    <div key={project.id} className="px-6 py-5 hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors cursor-pointer">
                                                    {project.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs text-white/35 font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        <Briefcase className="h-3.5 w-3.5" /> {project.client}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Star className="h-3.5 w-3.5 text-amber-400" /> {project.rating}
                                                    </span>
                                                    <span>{project.posted}</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0 ml-4">
                                                <div className="text-sm font-bold text-white">{project.budget.split(' - ')[0]}</div>
                                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Starting</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.tags.map((tag) => (
                                                    <span key={tag} className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <button className="h-8 px-4 rounded-lg text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all flex-shrink-0 ml-3">
                                                Quick Apply
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">

                        {/* Profile Completion */}
                        <div
                            className="rounded-2xl p-7 relative overflow-hidden group border border-indigo-500/15"
                            style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.08) 0%, rgba(59,130,246,0.08) 100%)' }}
                        >
                            <div
                                className="absolute -right-10 -top-10 w-36 h-36 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-700"
                                style={{ background: 'radial-gradient(circle, #818CF8, transparent)' }}
                            />
                            <Zap className="h-6 w-6 text-indigo-400 mb-4 relative" />
                            <h3 className="text-lg font-extrabold text-white mb-1 relative">Profile: 85%</h3>
                            <p className="text-white/40 text-sm leading-relaxed mb-4 relative">
                                Complete your skills and portfolio to stand out in the top 1%.
                            </p>
                            <div className="w-full rounded-full mb-5 relative" style={{ background: 'rgba(255,255,255,0.06)', height: 6 }}>
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: '85%', background: 'linear-gradient(90deg, #818CF8, #3B82F6)', boxShadow: '0 0 10px rgba(129,140,248,0.4)' }}
                                />
                            </div>
                            <button
                                className="w-full h-11 font-bold text-sm text-white rounded-xl transition-all hover:opacity-90 active:scale-[0.98] relative"
                                style={{ background: 'linear-gradient(135deg, #818CF8 0%, #3B82F6 100%)' }}
                            >
                                Optimize Profile
                            </button>
                        </div>

                        {/* Job Search */}
                        <div
                            className="rounded-2xl p-6"
                            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Find Opportunities</p>
                            <div className="relative mb-3">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                                <input
                                    type="text"
                                    placeholder="Search by skill or title..."
                                    className="w-full h-11 pl-10 pr-4 text-sm font-medium text-white/70 rounded-xl transition-all outline-none focus:border-indigo-500 placeholder-white/20"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                                />
                            </div>
                            <button
                                className="w-full h-10 font-bold text-sm text-white rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg, #818CF8 0%, #3B82F6 100%)' }}
                            >
                                Search
                            </button>
                        </div>

                        {/* Quick Links */}
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
