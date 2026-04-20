import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit2, Trash2, CalendarPlus, Loader2, Briefcase, Calendar } from 'lucide-react';
import type { ProjectDTO } from '../../types/project.dto';
import { ProjectStatus } from '../../constants/projectConstants';

interface ProjectTableProps {
    projects: ProjectDTO[];
    loading: boolean;
    onEdit?: (projectId: string) => void;
    onDelete?: (projectId: string) => void;
    onExtend?: (projectId: string) => void;
    emptyMessage?: string;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
    projects,
    loading,
    onEdit,
    onDelete,
    onExtend,
    emptyMessage = "No projects found."
}) => {
    const navigate = useNavigate();
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getStatusColor = (status: ProjectStatus) => {
        switch (status) {
            case ProjectStatus.OPEN: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case ProjectStatus.IN_PROGRESS: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case ProjectStatus.COMPLETED: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
            case ProjectStatus.CANCELLED: return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

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
        <div className="w-full overflow-x-auto bg-[#111118] rounded-2xl border border-white/5">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Budget</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Deadline</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {projects.map((project, index) => (
                        <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => navigate(`/projects/${project.id}/details`)}
                                    className="text-white font-bold hover:text-indigo-400 transition-colors text-left"
                                >
                                    {project.title}
                                </button>
                            </td>
                                    <div className="flex items-center gap-1.5 text-white font-medium">
                                        <span className="text-indigo-400 font-bold">₹</span>
                                        <span>{project.budget.toLocaleString()}</span>
                                    </div>
                            <td className="px-6 py-4 text-slate-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5 text-amber-400/70" />
                                    <span>{new Date(project.biddingDeadline).toLocaleDateString()}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(project.projectStatus)}`}>
                                    {project.projectStatus}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="relative inline-block text-left" ref={openDropdownId === project.id ? dropdownRef : null}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdownId(openDropdownId === project.id ? null : project.id!);
                                        }}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors focus:outline-none"
                                    >
                                        <MoreVertical className="h-5 w-5" />
                                    </button>

                                    {openDropdownId === project.id && (
                                        <div className={`absolute right-0 w-48 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 py-1 ${
                                            index >= projects.length - 2 && projects.length > 2 
                                                ? 'bottom-full mb-1' 
                                                : 'top-full mt-1'
                                        }`}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdownId(null);
                                                    onEdit?.(project.id!);
                                                }}
                                                className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3 focus:outline-none"
                                            >
                                                <Edit2 className="h-4 w-4" /> Edit Project
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdownId(null);
                                                    onExtend?.(project.id!);
                                                }}
                                                className="w-full px-4 py-3 text-left text-sm text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center gap-3 focus:outline-none"
                                            >
                                                <CalendarPlus className="h-4 w-4" /> Extend (+5 Days)
                                            </button>
                                            <div className="h-px bg-white/5 my-1" />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdownId(null);
                                                    onDelete?.(project.id!);
                                                }}
                                                className="w-full px-4 py-3 text-left text-sm text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-3 focus:outline-none"
                                            >
                                                <Trash2 className="h-4 w-4" /> Delete Project
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectTable;
