import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import {
    PlusCircle,
    Briefcase,
    Users,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight
} from 'lucide-react';

const ClientDashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    // Mock data - replace with actual API calls later
    const stats = {
        activeProjects: 3,
        totalBids: 24,
        hiredFreelancers: 5,
        totalSpent: 12500
    };

    const recentProjects = [
        {
            id: 1,
            title: 'E-commerce Website Development',
            status: 'active',
            bids: 12,
            budget: '$5,000 - $10,000',
            postedDate: '2 days ago'
        },
        {
            id: 2,
            title: 'Mobile App UI/UX Design',
            status: 'reviewing',
            bids: 8,
            budget: '$2,000 - $4,000',
            postedDate: '5 days ago'
        },
        {
            id: 3,
            title: 'Content Writing for Blog',
            status: 'completed',
            bids: 4,
            budget: '$500 - $1,000',
            postedDate: '1 week ago'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'reviewing':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <Clock className="h-4 w-4" />;
            case 'reviewing':
                return <AlertCircle className="h-4 w-4" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4" />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Here's what's happening with your projects today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Projects</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeProjects}</p>
                        </div>
                        <div className="bg-teal-100 p-3 rounded-lg">
                            <Briefcase className="h-6 w-6 text-teal-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>2 new this week</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Bids</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBids}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-600">
                        <span>Across all projects</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Hired Freelancers</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.hiredFreelancers}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-600">
                        <span>Currently working</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Spent</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">${stats.totalSpent.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-600">
                        <span>Lifetime value</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl shadow-lg p-8 mb-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold mb-2">Ready to start a new project?</h2>
                        <p className="text-teal-100">Post your project and get bids from talented freelancers worldwide.</p>
                    </div>
                    <button className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors flex items-center gap-2 shadow-md">
                        <PlusCircle className="h-5 w-5" />
                        Post a Project
                    </button>
                </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
                        <Link to="/projects" className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1">
                            View All
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {recentProjects.map((project) => (
                        <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                            {getStatusIcon(project.status)}
                                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            {project.bids} bids
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="h-4 w-4" />
                                            {project.budget}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            Posted {project.postedDate}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors">
                                        View Details
                                    </button>
                                    {project.status === 'reviewing' && (
                                        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm transition-colors">
                                            Review Bids
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Empty State - Show when no projects */}
            {recentProjects.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-600 mb-6">Get started by posting your first project and connect with talented freelancers.</p>
                    <button className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors inline-flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        Post Your First Project
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClientDashboard;
