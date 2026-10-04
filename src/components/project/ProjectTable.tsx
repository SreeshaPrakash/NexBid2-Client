import React, { useState, useEffect } from 'react';
import { useNavigate, generatePath } from 'react-router-dom';
import { ProjectRoute } from '../../constants/routeConstansts';
import { MoreVertical, Edit2, Trash2, CalendarPlus, Calendar } from 'lucide-react';
import type { ProjectDTO } from '../../types/project.dto';
import { ProjectStatus } from '../../constants/projectConstants';
import { DataTable } from '../common/DataTable';
import type { Column } from '../common/DataTable';

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.relative-dropdown-container')) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getStatusColor = (status: ProjectStatus, isExpired: boolean = false) => {
        if (isExpired && status === ProjectStatus.OPEN) {
            return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
        }
        switch (status) {
            case ProjectStatus.OPEN: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case ProjectStatus.IN_PROGRESS: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case ProjectStatus.COMPLETED: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
            case ProjectStatus.CANCELLED: return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const columns: Column<ProjectDTO>[] = [
        {
            header: 'Title',
            render: (project) => (
                <button
                    onClick={() => navigate(generatePath(ProjectRoute.DETAILS, { projectId: project.id! }))}
                    className="text-white font-bold hover:text-indigo-400 transition-colors text-left"
                >
                    {project.title}
                </button>
            )
        },
        {
            header: 'Budget',
            render: (project) => (
                <div className="flex items-center gap-1.5 text-white font-medium">
                    <span className="text-indigo-400 font-bold">₹</span>
                    <span>{project.budget.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'Deadline',
            render: (project) => (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-amber-400/70" />
                    <span>{new Date(project.biddingDeadline).toLocaleDateString()}</span>
                </div>
            )
        },
        {
            header: 'Status',
            render: (project) => {
                const isExpired = project.biddingDeadline ? new Date(project.biddingDeadline).getTime() < Date.now() : false;
                const displayStatus = (isExpired && project.projectStatus === ProjectStatus.OPEN ) ? 'ENDED' : project.projectStatus;
                return (
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(project.projectStatus, isExpired)}`}>
                        {displayStatus}
                    </span>
                );
            }
        },
        {
            header: 'Actions',
            headerClassName: 'text-right',
            cellClassName: 'text-right overflow-visible relative',
            render: (project, index) => (
                <div className="inline-block text-left relative-dropdown-container">
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
                        <div className={`absolute right-0 w-48 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[50] py-1 
                            ${
                            index === Math.min(projects.length, 4) - 1 && Math.min(projects.length, 4) > 1 
                                ? 'bottom-full mb-1' 
                                : 'top-full mt-1'
                        }
                        `}>
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
                                <Trash2 className="h-4 w-4" /> Delete Project123
                            </button>
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <DataTable
            data={projects}
            columns={columns}
            loading={loading}
            emptyMessage={emptyMessage}
            keyExtractor={(project) => project.id || Math.random().toString()}
            itemsPerPage={4}
            theme="dark"
        />
    );
};

export default ProjectTable;
