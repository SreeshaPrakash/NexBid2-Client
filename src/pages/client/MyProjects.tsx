import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, ChevronRight, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchClientProjects, deleteProject, updateProject, clearError } from '../../redux/slices/project/projectSlice';
import ProjectTable from '../../components/project/ProjectTable';
import { ProjectRoute } from '../../constants/routeConstansts';
import { ProjectStatus } from '../../constants/projectConstants';
import toast from 'react-hot-toast';

const MyProjects: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { projects, loading } = useAppSelector((state) => state.project);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(clearError());
        dispatch(fetchClientProjects());
    }, [dispatch]);

    const handleEdit = (projectId: string) => {
        navigate(ProjectRoute.EDIT.replace(':projectId', projectId));
    };

    const handleDelete = (projectId: string) => {
        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[250px]">
                <p className="text-sm font-bold text-slate-800">
                    Delete Project?
                </p>
                <p className="text-xs text-slate-600 -mt-2">
                    This action cannot be undone.
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await dispatch(deleteProject(projectId)).unwrap();
                                toast.success('Project deleted successfully');
                            } catch (err: any) {
                                toast.error(err || 'Failed to delete project');
                            }
                        }}
                        className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            style: { padding: '16px', borderRadius: '16px' }
        });
    };

    const handleExtend = async (projectId: string) => {
        const newDeadline = new Date();
        newDeadline.setDate(newDeadline.getDate() + 5);

        // Use local date components to avoid timezone shift from toISOString()
        const year = newDeadline.getFullYear();
        const month = String(newDeadline.getMonth() + 1).padStart(2, '0');
        const day = String(newDeadline.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        try {
            await dispatch(updateProject({
                projectId,
                data: { biddingDeadline: dateString }
            })).unwrap();
            toast.success("Deadline extended for 5 days");
        } catch (err: any) {
            toast.error("Failed to extend deadline");
        }
    };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const isNotCancelled = p.projectStatus !== ProjectStatus.CANCELLED;
        return matchesSearch && isNotCancelled;
    });

    return (
        <div className="w-full text-white">
            <main className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
                                <Briefcase className="h-3 w-3" />
                                <span>Project Management</span>
                                <ChevronRight className="h-3 w-3" />
                                <span className="text-white">My Projects</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Manage Your Projects</h1>
                            <p className="text-slate-400">Track, edit, and manage all your posted projects in one place.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-700 bg-slate-800/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <button
                                onClick={() => navigate(ProjectRoute.CREATE)}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all w-full sm:w-auto active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] whitespace-nowrap"
                            >
                                <Plus className="h-5 w-5" />
                                Post New Project
                            </button>
                        </div>
                    </div>

                    <ProjectTable
                        projects={filteredProjects}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onExtend={handleExtend}
                        emptyMessage="You haven't posted any projects yet. Click the button above to start."
                    />
                </div>
            </main>
        </div>
    );
};

export default MyProjects;
