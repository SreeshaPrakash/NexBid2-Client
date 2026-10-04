import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Briefcase,
    ChevronLeft,
    Calendar,
    Clock,
    Paperclip,
    ArrowRight,
    Loader2,
    Edit2,
    Trash2,
    Target,
    AlertCircle
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProjectById, deleteProject, clearCurrentProject, clearError } from '../../redux/slices/project/projectSlice';
import { placeBid, fetchMyBid, fetchProjectBids, updateBid, withdrawBid, addRealTimeBid } from '../../redux/slices/bid/bidSlice';
import toast from 'react-hot-toast';
import { ProjectRoute } from '../../constants/routeConstansts';
import PlaceBidModal from '../../components/common/PlaceBidModal';
import MyBid from '../../components/common/MyBid';
import { useSocket } from '../../hooks/useSocket';

const ProjectDetails: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentProject, loading } = useAppSelector((state) => state.project);
    const { user, activeRole } = useAppSelector((state) => state.auth);
    const { myBid, loading: bidLoading } = useAppSelector((state) => state.bid);
    const [isBidModalOpen, setIsBidModalOpen] = useState(false);
    const socket = useSocket(projectId);

    useEffect(() => {
        dispatch(clearError());
        if (projectId) {
            dispatch(fetchProjectById(projectId));
            if (activeRole === 'freelancer') {
                dispatch(fetchMyBid(projectId));
            }
        }
        return () => {
            dispatch(clearCurrentProject());
        };
    }, [projectId, dispatch, activeRole]);

    // Socket Listeners
    useEffect(() => {
        if (socket) {
            socket.on("new_bid_received", (bid) => {
                dispatch(addRealTimeBid(bid));
                toast.success(`New proposal received: ₹${Number(bid.bidAmount || 0).toLocaleString()}`, {
                    icon: '🔔',
                });
            });

            socket.on("bid_updated_received", (bid) => {
                dispatch(addRealTimeBid(bid));
                toast(`Proposal updated: ₹${Number(bid.bidAmount || 0).toLocaleString()}`, {
                    icon: '📝',
                });
            });

            return () => {
                socket.off("new_bid_received");
                socket.off("bid_updated_received");
            };
        }
    }, [socket, dispatch]);

    const handleDelete = () => {
        if (!currentProject) return;

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
                                await dispatch(deleteProject(currentProject.id || currentProject._id!)).unwrap();
                                toast.success("Project deleted successfully");
                                navigate(`/${ProjectRoute.MY_PROJECTS}`);
                            } catch (err: unknown) {
                                toast.error("Failed to delete project");
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

    // ─── Bid Handlers ───────────────────────────────────────
    const handlePlaceBid = async (data: { bidAmount: number; deliveryTime: number; message: string }) => {
        if (!projectId) return;
        try {
            await dispatch(placeBid({ projectId, ...data })).unwrap();
            toast.success("Your bid has been submitted successfully!");
            setIsBidModalOpen(false);
            // Refresh data
            dispatch(fetchMyBid(projectId));
            dispatch(fetchProjectBids(projectId));
        } catch (err: unknown) {
            const error = typeof err === 'string' ? err : (err as any)?.message || "Failed to submit bid";
            toast.error(error);
        }
    };

    const handleUpdateBid = async (bidId: string, data: { bidAmount: number; deliveryTime: number; message: string }) => {
        try {
            await dispatch(updateBid({ bidId, ...data })).unwrap();
            toast.success("Bid updated successfully!");
            if (projectId) {
                dispatch(fetchMyBid(projectId));
                dispatch(fetchProjectBids(projectId));
            }
        } catch (err: unknown) {
            const error = typeof err === 'string' ? err : (err as any)?.message || "Failed to update bid";
            toast.error(error);
        }
    };

    const handleWithdrawBid = async (bidId: string) => {
        try {
            await dispatch(withdrawBid(bidId)).unwrap();
            toast.success("Bid withdrawn successfully");
            if (projectId) {
                dispatch(fetchMyBid(projectId));
                dispatch(fetchProjectBids(projectId));
            }
        } catch (err: unknown) {
            const error = typeof err === 'string' ? err : (err as any)?.message || "Failed to withdraw bid";
            toast.error(error);
        }
    };

    // ─── Render States ──────────────────────────────────────
    if (loading && !currentProject) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px]">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium">Fetching project details...</p>
            </div>
        );
    }

    if (!currentProject) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] text-center px-4">
                <div className="h-20 w-20 rounded-3xl bg-rose-500/10 flex items-center justify-center mb-6">
                    <Briefcase className="h-10 w-10 text-rose-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Project Not Found</h1>
                <p className="text-slate-400 mb-8 max-w-md">The project you're looking for might have been removed or is no longer available.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/5 transition-all"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const projectOwnerId = currentProject.clientId;
    const isOwner = user?.id === projectOwnerId || (user as any)?._id === projectOwnerId;
    
    const isDeadlinePassed = currentProject?.biddingDeadline ? new Date(currentProject.biddingDeadline).getTime() < Date.now() : false;
    const isProjectOpen = currentProject.projectStatus === 'OPEN' && !isDeadlinePassed;
    const displayStatus = (isDeadlinePassed && currentProject.projectStatus === 'OPEN') ? 'ENDED' : currentProject.projectStatus;

    const statusColor = isProjectOpen
        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
        : displayStatus === 'ENDED'
            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
            : 'bg-amber-500/10 text-amber-500 border-amber-500/20';

    // Hide "Place a Bid" if freelancer already has an active bid or is the owner
    const canPlaceBid = activeRole === 'freelancer' && isProjectOpen && !isOwner && (!myBid || myBid.status === 'withdrawn');

    return (
        <div className="w-full">
            <main className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group"
                    >
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-bold uppercase tracking-widest">Back</span>
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-[#111118] rounded-[2.5rem] border border-white/5 p-8 md:p-12 shadow-2xl relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${statusColor}`}>
                                            {displayStatus}
                                        </div>
                                    </div>
                                </div>

                                <h1 className="text-4xl font-black text-white mb-6 leading-tight">{currentProject.title}</h1>

                                <div className="flex flex-wrap items-center gap-6 mb-10 pb-10 border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-500" />
                                        <span className="text-slate-400 text-sm font-medium">
                                            Posted {new Date(currentProject.createdAt!).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Project Overview</h3>
                                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
                                        {currentProject.description}
                                    </p>
                                </div>

                                {currentProject.skillsRequired && currentProject.skillsRequired.length > 0 && (
                                    <div className="mt-10">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Required Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {currentProject.skillsRequired.map((skill: string, index: number) => (
                                                <div key={index} className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-medium">
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {currentProject.attachments && currentProject.attachments.length > 0 && (
                                    <div className="mt-12 pt-12 border-t border-white/5">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Attachments</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {currentProject.attachments.map((file, index) => (
                                                <a
                                                    key={index}
                                                    href={file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group"
                                                >
                                                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                                        <Paperclip className="h-5 w-5 text-indigo-400" />
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <p className="text-white font-bold text-sm truncate">{file.split('/').pop()}</p>
                                                        <p className="text-slate-500 text-[10px] font-bold uppercase">Resource File</p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Your Bid Section — Freelancer Only */}
                            {activeRole === 'freelancer' && (
                                <MyBid
                                    bid={myBid}
                                    isProjectOpen={isProjectOpen}
                                    onUpdate={handleUpdateBid}
                                    onWithdraw={handleWithdrawBid}
                                    loading={bidLoading}
                                />
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-[#111118] rounded-[2rem] border border-white/5 p-8 shadow-xl">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Project Value & Timeline</h3>

                                <div className="space-y-8 mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                            <span className="text-xl font-bold text-emerald-500">₹</span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Fixed Budget</p>
                                            <p className="text-2xl font-black text-white">₹{currentProject.budget.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                                            <Clock className="h-6 w-6 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Bidding Ends</p>
                                            <p className="text-lg font-bold text-white">
                                                {new Date(currentProject.biddingDeadline).toLocaleDateString(undefined, {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {currentProject.deadline && (
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                <Target className="h-6 w-6 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Project Deadline</p>
                                                <p className="text-lg font-bold text-white">
                                                    {new Date(currentProject.deadline).toLocaleDateString(undefined, {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Freelancer: Place Bid Button (only if no active bid) */}
                                {canPlaceBid && (
                                    <button
                                        onClick={() => setIsBidModalOpen(true)}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 group"
                                    >
                                        Place a Bid
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}

                                {/* Freelancer: Bidding Closed */}
                                {activeRole === 'freelancer' && !isProjectOpen && (
                                    <div className="w-full py-4 bg-white/5 border border-white/5 text-slate-500 font-bold rounded-2xl text-center text-sm">
                                        Bidding Closed for this project
                                    </div>
                                )}

                                {/* Freelancer: Not allowed on own project */}
                                {activeRole === 'freelancer' && isOwner && (
                                    <div className="w-full py-6 px-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold rounded-2xl text-center text-sm flex flex-col items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                                            <AlertCircle className="h-6 w-6" />
                                        </div>
                                        <p>Bidding not allowed in your own projects</p>
                                    </div>
                                )}

                                {/* Client: Project Management */}
                                {isOwner && activeRole === 'client' && (
                                    <div className="space-y-4">
                                        <div className="h-px bg-white/5 my-6" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Project Management</p>
                                        <button
                                            onClick={() => navigate(ProjectRoute.EDIT.replace(':projectId', currentProject.id || currentProject._id!))}
                                            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            <Edit2 className="h-5 w-5 text-indigo-400" />
                                            Edit Project
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="w-full py-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                            Delete Project
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bid Modal */}
            <PlaceBidModal
                isOpen={isBidModalOpen}
                onClose={() => setIsBidModalOpen(false)}
                onSubmit={handlePlaceBid}
                projectTitle={currentProject.title}
                projectBudget={currentProject.budget}
                isSubmitting={bidLoading}
            />
        </div>
    );
};

export default ProjectDetails;
