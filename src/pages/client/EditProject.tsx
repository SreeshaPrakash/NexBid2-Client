import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Briefcase, ChevronRight, Edit2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProjectById, updateProject, clearCurrentProject, clearError } from '../../redux/slices/project/projectSlice';
import ProjectForm from '../../components/project/ProjectForm';
import { ProjectRoute } from '../../constants/routeConstansts';
import toast from 'react-hot-toast';
import type { UpdateProjectDTO } from '../../types/project.dto';

const EditProject: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentProject, loading, error } = useAppSelector((state) => state.project);

    useEffect(() => {
        dispatch(clearError());
        if (projectId) {
            dispatch(fetchProjectById(projectId));
        }
        return () => {
            dispatch(clearCurrentProject());
        };
    }, [projectId, dispatch]);

    const handleSubmit = async (data: UpdateProjectDTO) => {
        if (!projectId) return;
        try {
            await dispatch(updateProject({ projectId, data })).unwrap();
            toast.success('Project updated successfully!');
            navigate(`/${ProjectRoute.MY_PROJECTS}`);
        } catch (err: any) {
            toast.error(err || 'Failed to update project');
        }
    };

    if (loading && !currentProject) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <main className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
                            <Briefcase className="h-3 w-3" />
                            <span>Project Management</span>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-white">Edit Project</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 italic tracking-tight flex items-center gap-3">
                            <Edit2 className="h-7 w-7 text-indigo-500" />
                            EDIT PROJECT
                        </h1>
                        <p className="text-slate-400">Update your project details, budget, or timeline.</p>
                    </div>

                    <div className="bg-[#111118] rounded-3xl border border-white/5 p-8 md:p-12 shadow-2xl">
                        {currentProject && (
                            <ProjectForm 
                                initialData={currentProject} 
                                onSubmit={handleSubmit as any} 
                                isLoading={loading} 
                                error={error} 
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditProject;
