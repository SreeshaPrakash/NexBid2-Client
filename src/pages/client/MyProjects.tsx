import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchClientProjects, deleteProject, extendProject, clearError } from '../../redux/slices/project/projectSlice';
import ProjectTable from '../../components/project/ProjectTable';
import { ProjectRoute } from '../../constants/routeConstansts';
import toast from 'react-hot-toast';

const MyProjects: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { projects, totalProjects, loading } = useAppSelector((state) => state.project);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        dispatch(clearError());
        dispatch(fetchClientProjects({ page: currentPage, limit: itemsPerPage }));
    }, [dispatch, currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                            } catch (err: unknown) {
                                toast.error((err as string) || 'Failed to delete project');
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
        try {
            await dispatch(extendProject(projectId)).unwrap();
            toast.success("Bidding deadline successfully extended by 5 days from the current deadline");
        } catch (err: unknown) {
            toast.error((err as string) || "Failed to extend deadline");
        }
    };

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

                        <button
                            onClick={() => navigate(ProjectRoute.CREATE)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                        >
                            <Plus className="h-5 w-5" />
                            Post New Project
                        </button>
                    </div>

                    <ProjectTable
                        projects={projects}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onExtend={handleExtend}
                        emptyMessage="You haven't posted any projects yet. Click the button above to start."
                        pagination={{
                            currentPage: currentPage,
                            totalPages: Math.ceil(totalProjects / itemsPerPage),
                            totalItems: totalProjects,
                            onPageChange: handlePageChange
                        }}
                        itemsPerPage={itemsPerPage}
                    />
                </div>
            </main>
        </div>
    );
};

export default MyProjects;
