import React, { useEffect, useState } from 'react';
import {
    Users,
    UserX,
    UserCheck,
    Search,
    Loader2,
    AlertTriangle,
    Mail,
    Shield,
    X,
    CheckCircle2,
    Filter,
    ChevronDown,
    Calendar,
    ArrowUpDown
} from 'lucide-react';
import { getAllUsers, toggleBlockStatus } from '../../services/adminService';
import toast from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    roles: string[];
    isBlocked: boolean;
    isEmailVerified: boolean;
    createdAt?: string;
}

const Dashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // Modal state for "Assurance Check"
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getAllUsers({
                search: searchTerm,
                role: selectedRole,
                status: selectedStatus
            });
            if (response.success) {
                setUsers(response.users || []);
            }
        } catch (error: any) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [searchTerm, selectedRole, selectedStatus]);

    const handleToggleClick = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleConfirmToggle = async () => {
        if (!selectedUser) return;

        setActionLoading(true);
        try {
            const response = await toggleBlockStatus(selectedUser.id, !selectedUser.isBlocked);
            if (response.success) {
                toast.success(`User ${selectedUser.isBlocked ? 'unblocked' : 'blocked'} successfully`);
                fetchUsers(); // Refresh list
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
        <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 p-6 lg:p-10 max-w-[1600px] mx-auto">
                {/* Header section */}
                <header className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                                    <Shield className="w-6 h-6 text-indigo-400" />
                                </div>
                                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-[0.2em]">Nexus Control Center</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                                User <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Intelligence</span>
                            </h1>
                            <p className="text-slate-400 mt-3 text-lg max-w-2xl">
                                Advanced administrative workstation for managing platform participants and service integrity.
                            </p>
                        </div>

                        {/* Quick Stats integration point */}
                        <div className="hidden xl:flex gap-6">
                            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-5 rounded-2xl min-w-[180px]">
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Assets</div>
                                <div className="text-2xl font-bold text-white">{users.filter(u => !u.isBlocked).length}</div>
                            </div>
                            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-5 rounded-2xl min-w-[180px]">
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Restricted</div>
                                <div className="text-2xl font-bold text-red-400">{users.filter(u => u.isBlocked).length}</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Search and Filters Station */}
                <section className="mb-8 p-1 bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* Dominant Search Bar */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, email, or identifier..."
                                className="block w-full pl-16 pr-6 py-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all shadow-inner font-light"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-6 flex items-center text-slate-500 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            )}
                        </div>

                        {/* Filter Controls Row */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20 mr-2">
                                <Filter className="w-4 h-4" />
                                <span className="text-sm font-bold uppercase tracking-wider">Filters</span>
                            </div>

                            {/* Role Filter */}
                            <div className="relative flex-1 min-w-[200px]">
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="appearance-none block w-full px-5 py-3 pr-10 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer hover:bg-slate-800/50"
                                >
                                    <option value="">All Roles</option>
                                    <option value="client">Clients</option>
                                    <option value="freelancer">Freelancers</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>

                            {/* Status Filter */}
                            <div className="relative flex-1 min-w-[200px]">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="appearance-none block w-full px-5 py-3 pr-10 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer hover:bg-slate-800/50"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="active">Active Members</option>
                                    <option value="blocked">Restricted Access</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>

                            {/* Reset Button */}
                            {(selectedRole || selectedStatus || searchTerm) && (
                                <button
                                    onClick={() => {
                                        setSelectedRole('');
                                        setSelectedStatus('');
                                        setSearchTerm('');
                                    }}
                                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-sm font-semibold transition-all border border-slate-700"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Table section */}
                <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden min-h-[400px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-slate-900/40 border-b border-slate-700/50">
                                    <th className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-[0.2em] first:rounded-tl-3xl">
                                        <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Identity</div>
                                    </th>
                                    <th className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                                        <div className="flex items-center gap-2"><ArrowUpDown className="w-3.5 h-3.5" /> Classification</div>
                                    </th>
                                    <th className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                                        <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Registration</div>
                                    </th>
                                    <th className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                                        Status
                                    </th>
                                    <th className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-[0.2em] text-right last:rounded-tr-3xl">
                                        Security Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="relative">
                                                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                                                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20"></div>
                                                </div>
                                                <span className="text-slate-400 text-sm font-mono tracking-widest uppercase">Initializing Stream...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-6 bg-slate-900/50 rounded-full border border-slate-700/50">
                                                    <Users className="w-12 h-12 text-slate-700" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-white font-bold text-lg">No Results Found</h4>
                                                    <p className="text-slate-500 text-sm">Adjust your filters or search term to widen your search.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold border border-white/5 shadow-lg overflow-hidden">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0f172a] ${user.isEmailVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{user.name}</div>
                                                        <div className="text-sm text-slate-500 flex items-center gap-2 mt-0.5 font-light">
                                                            <Mail className="w-3.5 h-3.5 text-slate-600" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {user.roles.map(role => (
                                                        <span key={role} className="px-3 py-1 bg-indigo-500/5 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/10 rounded-md">
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm text-slate-400 font-mono">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '---'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {user.isBlocked ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                                        <span className="text-xs font-bold text-red-500 uppercase tracking-tighter italic">Restricted</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">Authorized</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => handleToggleClick(user)}
                                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ml-auto ${user.isBlocked
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                                        : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                                                        }`}
                                                >
                                                    {user.isBlocked ? (
                                                        <><UserCheck className="w-4 h-4" /> Restore Access</>
                                                    ) : (
                                                        <><UserX className="w-4 h-4" /> Revoke Access</>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Premium Confirmation Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900 w-full max-w-lg rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden transform animate-in zoom-in-95 duration-300">
                        <div className="relative h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500"></div>

                        <div className="p-10">
                            <div className="flex items-center justify-center mb-8">
                                <div className={`p-6 rounded-[2rem] shadow-2xl ${selectedUser.isBlocked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {selectedUser.isBlocked ? (
                                        <CheckCircle2 className="w-12 h-12" />
                                    ) : (
                                        <AlertTriangle className="w-12 h-12" />
                                    )}
                                </div>
                            </div>

                            <div className="text-center space-y-4">
                                <h3 className="text-3xl font-black text-white tracking-tight leading-none uppercase">
                                    {selectedUser.isBlocked ? 'Restore Clearance?' : 'Revoke Clearance?'}
                                </h3>
                                <p className="text-slate-400 text-lg font-light leading-relaxed">
                                    You are initiating a security status change for <span className="text-white font-bold italic">@{selectedUser.name.toLowerCase().replace(/\s/g, '_')}</span>.
                                </p>
                            </div>

                            <div className="bg-slate-800/50 rounded-2xl p-6 mt-8 space-y-4 border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">System Implications</div>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed font-light italic">
                                    {selectedUser.isBlocked
                                        ? "Restoring access will immediately re-enable all platform features and historical data associated with this identity."
                                        : "Revoking access will immediately disconnect user from the network and flag the identity as restricted across all services."
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-px bg-white/5">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-10 py-8 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white font-bold text-sm uppercase tracking-widest transition-all"
                            >
                                Abort
                            </button>
                            <button
                                onClick={handleConfirmToggle}
                                disabled={actionLoading}
                                className={`px-10 py-8 font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${selectedUser.isBlocked
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                    : 'bg-red-600 hover:bg-red-500 text-white'
                                    } ${actionLoading ? 'opacity-50' : ''}`}
                            >
                                {actionLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Execute Order'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
