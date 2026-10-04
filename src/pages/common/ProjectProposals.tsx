import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Search, FileText, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProjectBids, fetchMyBid, updateBid, withdrawBid, addRealTimeBid } from '../../redux/slices/bid/bidSlice';
import MyBid from '../../components/common/MyBid';
import ProposalCard from '../../components/common/ProposalCard';
import toast from 'react-hot-toast';
import { useSocket } from '../../hooks/useSocket';

const ProjectProposals: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const dispatch = useAppDispatch();
    const { activeRole, user } = useAppSelector((state) => state.auth);
    const { bids, myBid, loading } = useAppSelector((state) => state.bid);
    const { currentProject } = useAppSelector((state) => state.project);
    const socket = useSocket(projectId);

    const isDeadlinePassed = currentProject?.biddingDeadline ? new Date(currentProject.biddingDeadline).getTime() < Date.now() : false;
    const isProjectOpen = currentProject?.projectStatus === 'OPEN' && !isDeadlinePassed;

    useEffect(() => {
        if (projectId) {
            dispatch(fetchProjectBids(projectId));
            if (activeRole === 'freelancer') {
                dispatch(fetchMyBid(projectId));
            }
        }
    }, [projectId, activeRole, dispatch]);

    // Socket Listeners for Real-time Updates
    useEffect(() => {
        if (socket) {
            socket.on("new_bid_received", (bid) => {
                dispatch(addRealTimeBid(bid));
            });

            socket.on("bid_updated_received", (bid) => {
                dispatch(addRealTimeBid(bid));
            });

            return () => {
                socket.off("new_bid_received");
                socket.off("bid_updated_received");
            };
        }
    }, [socket, dispatch]);

    // ─── Bid Handlers ───────────────────────────────────────
    const handleUpdateBid = async (bidId: string, data: { bidAmount: number; deliveryTime: number; message: string }) => {
        try {
            await dispatch(updateBid({ bidId, ...data })).unwrap();
            toast.success("Bid updated successfully!");
            if (projectId) {
                dispatch(fetchMyBid(projectId));
                dispatch(fetchProjectBids(projectId));
            }
        } catch (err: unknown) {
            const error = err as string;
            toast.error(error || "Failed to update bid");
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
            const error = err as string;
            toast.error(error || "Failed to withdraw bid");
        }
    };

    // Sort bids by createdAt (latest first) and filter only active bids
    const sortedBids = bids
        .filter(bid => bid.status === 'active')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 1. Your Proposal Section — Freelancer Only */}
            {activeRole === 'freelancer' && (
                <MyBid
                    bid={myBid}
                    isProjectOpen={isProjectOpen}
                    onUpdate={handleUpdateBid}
                    onWithdraw={handleWithdrawBid}
                    loading={loading}
                />
            )}

            {/* 2. All Proposals Section */}
            <div className="bg-[#111118] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="px-8 md:px-12 py-8 border-b border-white/5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                                <FileText className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">All Proposals</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {sortedBids.length} proposal{sortedBids.length !== 1 ? 's' : ''} submitted
                                </p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search proposals..."
                                className="bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all w-full sm:w-64"
                            />
                        </div>
                    </div>
                </div>

                {/* Proposals List */}
                <div className="p-8 md:p-12">
                    {loading && sortedBids.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                            <p className="text-slate-500 font-medium">Loading proposals...</p>
                        </div>
                    ) : sortedBids.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {sortedBids.map((bid) => {
                                const isUserBid = activeRole === 'freelancer' && (bid.id === myBid?.id || (user && bid.freelancerId === user.id));
                                return (
                                    <div key={bid.id} className={isUserBid ? "ring-2 ring-indigo-500 rounded-2xl" : ""}>
                                        <ProposalCard
                                            proposal={{
                                                id: bid.id,
                                                freelancerName: isUserBid ? "You" : (bid.freelancerName || `Freelancer ${bid.freelancerId.slice(-6)}`),
                                                freelancerTitle: isUserBid ? "Senior Full-Stack Developer" : (bid.freelancerTitle || "Freelancer"),
                                                bidAmount: bid.bidAmount,
                                                deliveryTime: bid.deliveryTime,
                                                message: bid.message,
                                                status: bid.status,
                                                createdAt: bid.createdAt
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                                <Users className="h-10 w-10 text-slate-700" />
                            </div>
                            <p className="text-slate-500 font-medium">No proposals yet</p>
                            <p className="text-slate-600 text-xs mt-2 uppercase tracking-widest font-black">
                                Be the first to bid on this project
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectProposals;
