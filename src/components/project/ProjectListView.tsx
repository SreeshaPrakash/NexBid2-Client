import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Briefcase, Loader2 } from 'lucide-react';
import type { ProjectDTO } from '../../types/project.dto';
import { ProjectStatus } from '../../constants/projectConstants';

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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Reduced to 4 so it's easier to see pagination with fewer projects

    useEffect(() => {
        setCurrentPage(1);
    }, [projects.length]);

    const totalPages = Math.ceil(projects.length / itemsPerPage);
    const paginatedProjects = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            {paginatedProjects.map((project) => {
                const isExpired = project.biddingDeadline ? new Date(project.biddingDeadline).getTime() < Date.now() : false;
                const displayStatus = (isExpired && project.projectStatus === ProjectStatus.OPEN) ? 'ENDED' : project.projectStatus;
                
                const statusColor = displayStatus === 'ENDED' 
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';

                return (
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
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                                {displayStatus}
                            </span>
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
                );
            })}

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 mt-4 bg-[#111118] border border-white/5 rounded-2xl gap-4">
                <span className="text-sm text-slate-400">
                    Showing <span className="font-medium text-white">{projects.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, projects.length)}</span> of <span className="font-medium text-white">{projects.length}</span> results
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-bold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage >= totalPages}
                        className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 border border-indigo-500 rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectListView;
