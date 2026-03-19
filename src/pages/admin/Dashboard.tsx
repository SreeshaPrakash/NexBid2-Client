import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Search,
    Loader2,
    X,
    UserCheck,
    UserX,
    Users,
    ShieldCheck,
    ShieldX,
    Check,
    Clock,
    Eye
} from 'lucide-react';
import { getAllUsers, toggleBlockStatus, getPendingVerifications, approveVerification, rejectVerification } from '../../services/adminService';
import toast from 'react-hot-toast';

interface UserData {
    id: string;
    name: string;
    email: string;
    roles: string[];
    isBlocked: boolean;
    isEmailVerified: boolean;
    createdAt?: string;
}

interface FreelancerVerification {
    id: string;
    name: string;
    email: string;
    title: string;
    verificationStatus: string;
    createdAt: string;
    updatedAt : string
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialTab = (searchParams.get('tab') as 'users' | 'verifications') || 'users';
    const [activeTab, setActiveTab] = useState<'users' | 'verifications'>(initialTab);
    const [users, setUsers] = useState<UserData[]>([]);
    const [verifications, setVerifications] = useState<FreelancerVerification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const limit = 4;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getAllUsers({
                search: searchTerm,
                role: selectedRole,
                status: selectedStatus,
                page: currentPage,
                limit: limit
            });
            if (response.success) {
                setUsers(response.users || []);
                if (response.pagination) {
                    setTotalPages(response.pagination.totalPages);
                    setTotalUsers(response.pagination.totalUsers);
                }
            }
        } catch (error: any) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const fetchVerifications = async () => {
        setLoading(true);
        try {
            const response = await getPendingVerifications();
            if (response.success) {
                setVerifications(response.data || []);
            }
        } catch (error: any) {
            toast.error("Failed to load verification requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'verifications' || tab === 'users') {
            setActiveTab(tab as 'users' | 'verifications');
        }
    }, [searchParams]);

    useEffect(() => {
        // Initial fetch for both on mount to have badge counts ready
        fetchUsers();
        fetchVerifications();
    }, []);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else {
            fetchVerifications();
        }
    }, [activeTab, searchTerm, selectedRole, selectedStatus, currentPage]);

    const handleToggleClick = (user: UserData) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleApprove = async (id: string) => {
        setActionLoading(true);
        try {
            const response = await approveVerification(id);
            if (response.success) {
                toast.success("Freelancer verified successfully");
                fetchVerifications();
            }
        } catch (error: any) {
            toast.error("Approval failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectClick = (id: string) => {
        setSelectedId(id);
        setRejectionReason('');
        setIsRejectModalOpen(true);
    };

    const handleConfirmReject = async () => {
        if (!selectedId || !rejectionReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        setActionLoading(true);
        try {
            const response = await rejectVerification(selectedId, rejectionReason);
            if (response.success) {
                toast.success("Verification rejected");
                fetchVerifications();
                setIsRejectModalOpen(false);
                setSelectedId(null);
            }
        } catch (error: any) {
            toast.error("Rejection failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmToggle = async () => {
        if (!selectedUser) return;

        setActionLoading(true);
        try {
            const response = await toggleBlockStatus(selectedUser.id, !selectedUser.isBlocked);
            if (response.success) {
                toast.success(`User ${selectedUser.isBlocked ? 'unblocked' : 'blocked'} successfully`);
                fetchUsers();
                setIsModalOpen(false);
                setSelectedUser(null);
            }
        } catch (error: any) {
            toast.error("Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-indigo-600" />
                        <h1 className="text-xl font-bold text-gray-900">Admin Control Center</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Dashboard</h2>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Manage platform security, users, and professional verifications.</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 p-1 bg-gray-200/50 rounded-xl mb-8 w-fit border border-gray-200">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'users'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Users className="h-4 w-4" />
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveTab('verifications')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'verifications'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <ShieldCheck className="h-4 w-4" />
                        Verification Requests
                        {verifications.length > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded-md text-[10px]">
                                {verifications.length}
                            </span>
                        )}
                    </button>
                </div>

                {activeTab === 'users' ? (
                    <>
                        {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative md:col-span-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <div>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">All Roles</option>
                                <option value="client">Clients</option>
                                <option value="freelancer">Freelancers</option>
                            </select>
                        </div>

                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Verified
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registered
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                                            <div className="flex justify-center items-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-indigo-500 mr-2" />
                                                Loading users...
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                                            No users found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map(role => (
                                                        <span key={role} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.isBlocked ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Blocked
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.isEmailVerified ? (
                                                    <span className="text-green-600 font-medium">Yes</span>
                                                ) : (
                                                    <span className="text-amber-500 font-medium">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                {user.roles.includes('freelancer') && (
                                                    <button
                                                        onClick={() => navigate(`/admin/freelancer-profile/${user.id}?from=users`)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all active:scale-95"
                                                    >
                                                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                                                        View Profile
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleToggleClick(user)}
                                                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${user.isBlocked
                                                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                                >
                                                    {user.isBlocked ? (
                                                        <>
                                                            <UserCheck className="mr-1.5 h-3 w-3" />
                                                            Unblock
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserX className="mr-1.5 h-3 w-3" />
                                                            Block
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination UI */}
                    {!loading && totalUsers > 0 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-end">

                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                        >
                                            <span className="sr-only">Prev</span>
                                            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Previous
                                        </button>

                                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700">
                                            Page {currentPage} of {totalPages}
                                        </span>

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                        >
                                            Next
                                            <svg className="h-5 w-5 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="sr-only">Next</span>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </>
        ) : (
                    /* Verification Table */
                    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Freelancer</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Professional Title</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <div className="flex justify-center items-center gap-3 text-gray-500">
                                                    <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                                                    <span className="font-medium">Loading requests...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : verifications.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <ShieldCheck className="h-12 w-12 mb-4 opacity-20" />
                                                    <p className="text-lg font-bold text-gray-900 mb-1">No Pending Requests</p>
                                                    <p className="text-sm">Great! All professional verifications have been processed.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        verifications.map((req) => (
                                            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border border-slate-200">
                                                            {req.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-bold text-gray-900">{req.name}</div>
                                                            <div className="text-sm text-gray-500">{req.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 font-medium">{req.title}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                                                        <Clock className="mr-1.5 h-3 w-3" />
                                                        Pending
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(req.updatedAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                    <button
                                                        onClick={() => navigate(`/admin/freelancer-profile/${req.id}?from=verifications`)}
                                                        className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all active:scale-95"
                                                    >
                                                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                                                        View Profile
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(req.id)}
                                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-all shadow-md shadow-green-900/10 active:scale-95"
                                                    >
                                                        <Check className="h-3.5 w-3.5 mr-1.5" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectClick(req.id)}
                                                        className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-all active:scale-95"
                                                    >
                                                        <X className="h-3.5 w-3.5 mr-1.5" />
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Confirmation Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${selectedUser.isBlocked ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                        {selectedUser.isBlocked ? (
                                            <UserCheck className="h-6 w-6 text-green-600" aria-hidden="true" />
                                        ) : (
                                            <UserX className="h-6 w-6 text-red-600" aria-hidden="true" />
                                        )}
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            {selectedUser.isBlocked ? 'Unblock User' : 'Block User'}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to {selectedUser.isBlocked ? 'restore access for' : 'restrict access for'} <strong>{selectedUser.name}</strong>?
                                                {selectedUser.isBlocked
                                                    ? ' They will be able to log in and use the platform again.'
                                                    : ' They will be immediately signed out and prevented from logging in.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${selectedUser.isBlocked
                                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                        }`}
                                    onClick={handleConfirmToggle}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        selectedUser.isBlocked ? 'Confirm Unblock' : 'Confirm Block'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Reason Modal */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 py-12">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsRejectModalOpen(false)}></div>
                        
                        <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-lg w-full p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-red-100 rounded-2xl">
                                    <ShieldX className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Reject Verification</h3>
                                    <p className="text-sm text-gray-500">Please provide a reason why this profile was declined.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 ml-1">Rejection Reason</label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={4}
                                    className="block w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
                                    placeholder="Examples: Profile missing portfolio, Incomplete skills list, etc."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <button
                                    onClick={() => setIsRejectModalOpen(false)}
                                    className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmReject}
                                    disabled={actionLoading || !rejectionReason.trim()}
                                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldX className="h-4 w-4" />}
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;




