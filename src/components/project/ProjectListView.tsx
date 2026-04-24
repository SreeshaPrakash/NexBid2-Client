import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Briefcase, Loader2 } from 'lucide-react';
import type { ProjectDTO } from '../../types/project.dto';

interface ProjectListViewProps {
    projects: ProjectDTO[];
    loading: boolean;
    emptyMessage?: string;
}

const ProjectListView: React.FC<ProjectListViewProps> = ({
    projects,
    loading,
    emptyMessage = "No open projects found."
}) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium">Loading projects...</p>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-[#111118] rounded-3xl border border-white/5 border-dashed">
                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <Briefcase className="h-8 w-8 text-slate-600" />
                </div>
                <p className="text-slate-400 font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            {projects.map((project) => (
                <div 
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}/details`)}
                    className="group bg-[#111118] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 hover:bg-white/[0.02] transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div className="flex-grow max-w-3xl">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {project.title}
                            </h3>
                        </div>
                        <p className="text-slate-400 text-sm line-clamp-2 mb-4 md:mb-0">
                            {project.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 md:gap-8 min-w-fit">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight mb-1">Budget</span>
                            <div className="flex items-center gap-1.5 text-white font-bold">
                                <span className="text-emerald-400 font-bold text-lg">₹</span>
                                <span>{project.budget.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight mb-1">Bid Deadline</span>
                            <div className="flex items-center gap-2 text-white font-medium text-sm">
                                <Clock className="h-4 w-4 text-amber-400/70" />
                                <span>{new Date(project.biddingDeadline).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight mb-1">Posted On</span>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Calendar className="h-4 w-4" />
                                <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>

                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                            <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectListView;
