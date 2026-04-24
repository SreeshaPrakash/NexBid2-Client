import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ChevronRight, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createProject, clearError } from '../../redux/slices/project/projectSlice';
import ProjectForm from '../../components/project/ProjectForm';
import { ProjectRoute } from '../../constants/routeConstansts';
import toast from 'react-hot-toast';
import type { CreateProjectDTO } from '../../types/project.dto';

const CreateProject: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.project);

    React.useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = async (data: CreateProjectDTO) => {
        try {
            await dispatch(createProject(data)).unwrap();
            toast.success('Project posted successfully!');
            navigate(`/${ProjectRoute.MY_PROJECTS}`);
        } catch (error: unknown) {
            console.error("Project submission error:", error);
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to create project");
        }
    };

    return (
        <div className="w-full">
            <main className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
                            <Briefcase className="h-3 w-3" />
                            <span>Project Management</span>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-white">Post New Project</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 italic tracking-tight flex items-center gap-3">
                            <Plus className="h-8 w-8 text-indigo-500" />
                            POST A PROJECT
                        </h1>
                        <p className="text-slate-400">Specify your requirements and find the perfect freelancer for your project.</p>
                    </div>

                    <div className="bg-[#111118] rounded-3xl border border-white/5 p-8 md:p-12 shadow-2xl">
                        <ProjectForm onSubmit={handleSubmit} isLoading={loading} error={error} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateProject;
