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
    Star
} from 'lucide-react';

const FreelancerDashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    // Mock data for freelancer stats
    const stats = {
        activeBids: 12,
        ongoingProjects: 3,
        completedProjects: 24,
        totalEarnings: '₹1,24,500'
    };

    // Mock data for recommended projects
    const recommendedProjects = [
        {
            id: '1',
            title: 'Modern E-commerce Website',
            client: 'TechCorp Solutions',
            budget: '₹45,000 - ₹60,000',
            posted: '2 hours ago',
            tags: ['React', 'Node.js', 'Tailwind'],
            rating: 4.8
        },
        {
            id: '2',
            title: 'Mobile App UI/UX Design',
            client: 'Creative Studio',
            budget: '₹25,000 - ₹35,000',
            posted: '5 hours ago',
            tags: ['Figma', 'UI Design', 'Mobile'],
            rating: 4.9
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                <p className="text-gray-600 mt-1">Here's what's happening with your projects today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Bids</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeBids}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Ongoing Projects</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.ongoingProjects}</p>
                        </div>
                        <div className="bg-indigo-100 p-3 rounded-lg">
                            <Briefcase className="h-6 w-6 text-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedProjects}</p>
                        </div>
                        <div className="bg-teal-100 p-3 rounded-lg">
                            <CheckCircle className="h-6 w-6 text-teal-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEarnings}</p>
                        </div>
                        <div className="bg-emerald-100 p-3 rounded-lg">
                            <DollarSign className="h-6 w-6 text-emerald-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Recommended Projects */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
                            <button className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1">
                                Browse All Projects
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {recommendedProjects.map((project) => (
                                <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 hover:text-teal-600 cursor-pointer transition-colors">
                                            {project.title}
                                        </h3>
                                        <span className="text-lg font-bold text-gray-900">{project.budget.split(' - ')[0]}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="h-4 w-4" />
                                            {project.client}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            {project.rating}
                                        </span>
                                        <span>Posted {project.posted}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Search Component */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4 text-lg">Find Your Next Project</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by skills or title..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <button className="w-full mt-4 bg-teal-600 text-white font-medium py-2 rounded-lg hover:bg-teal-700 transition-colors">
                            Apply Filter
                        </button>
                    </div>

                    {/* Quick Access */}
                    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
                        <h3 className="font-bold text-lg mb-2">Profile Status: 85%</h3>
                        <p className="text-teal-50 text-sm mb-4">Complete your profile to increase your chances of being hired by top clients.</p>
                        <div className="w-full bg-teal-900/30 rounded-full h-2 mb-6">
                            <div className="bg-white h-2 rounded-full w-[85%]"></div>
                        </div>
                        <button className="w-full bg-white text-teal-600 font-bold py-2 rounded-lg hover:bg-teal-50 transition-colors text-sm">
                            Finish My Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreelancerDashboard;
