import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Search, Loader2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { useSocket } from '../../hooks/useSocket';
import useDebounce from '../../hooks/useDebounce';
import type { Bid } from '../../redux/slices/bid/bidSlice';
import { addRealTimeBid, fetchProjectBids, updateBid, withdrawBid } from '../../redux/slices/bid/bidSlice';
import MyBid from '../../components/common/MyBid';
import ProposalCard from '../../components/common/ProposalCard';
import toast from 'react-hot-toast';

const ProjectProposals: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const dispatch = useAppDispatch();
    const { activeRole, user } = useAppSelector((state) => state.auth);
    const { bids, loading, error } = useAppSelector((state) => state.bid);
    
    const [filterTerm, setFilterTerm] = React.useState('');
    const debouncedFilter = useDebounce(filterTerm, 400);
    
    // Initialize Socket
    const socket = useSocket(projectId);
    
    const myBid = bids.find(b => b.freelancerId === user?.id);

    useEffect(() => {
        if (projectId) {
            dispatch(fetchProjectBids(projectId));
        }
    }, [projectId, dispatch]);

    useEffect(() => {
        if (socket) {
            socket.on('new_bid_received', (bid: Bid) => {
                dispatch(addRealTimeBid(bid));
            });

            socket.on('bid_updated_received', (bid: Bid) => {
                dispatch(addRealTimeBid(bid));
            });

            return () => {
                socket.off('new_bid_received');
                socket.off('bid_updated_received');
            };
        }
    }, [socket, dispatch]);

    const handleBidUpdate = async (bidId: string, data: { bidAmount: number; deliveryTime: number; message: string }) => {
        try {
            await dispatch(updateBid({ bidId, ...data })).unwrap();
            toast.success("Bid updated successfully");
        } catch (err: unknown) {
            toast.error((err as string) || "Failed to update bid");
        }
    };

    const handleBidWithdraw = async (bidId: string) => {
        if (window.confirm("Are you sure you want to withdraw your bid?")) {
            try {
                await dispatch(withdrawBid(bidId)).unwrap();
                toast.success("Bid withdrawn successfully");
            } catch (err: unknown) {
                toast.error((err as string) || "Failed to withdraw bid");
            }
        }
    };

    const filteredBids = bids.filter(bid => 
        (bid.freelancerName || 'Freelancer').toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        bid.message.toLowerCase().includes(debouncedFilter.toLowerCase())
    );

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-red-400 font-medium">{error}</p>
                <button 
                    onClick={() => projectId && dispatch(fetchProjectBids(projectId))}
                    className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (loading && bids.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium">Loading proposals...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* 1. Your Proposal Section (Visible to Freelancers) */}
            {activeRole === 'freelancer' && (
                <div className="space-y-6">
                    <MyBid 
                        bid={myBid || null}
                        isProjectOpen={true} // Assuming it's open if we're here, could be more precise
                        onUpdate={handleBidUpdate}
                        onWithdraw={handleBidWithdraw}
                        loading={loading}
                    />
                </div>
            )}

            {/* 2. All Proposals Section */}
            <div className="bg-[#111118] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-white">All Proposals</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Total of {bids.length} proposals submitted</p>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Filter candidates..." 
                            value={filterTerm}
                            onChange={(e) => setFilterTerm(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all w-full sm:w-64"
                        />
                    </div>
                </div>

                {filteredBids.length === 0 ? (
                    <div className="p-12 text-center h-[300px] flex flex-col items-center justify-center">
                        <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                            <Users className="h-10 w-10 text-slate-700" />
                        </div>
                        <p className="text-slate-500 font-medium">No proposals found</p>
                        <p className="text-slate-600 text-xs mt-2 uppercase tracking-widest font-black">
                            {filterTerm ? 'Try adjusting your search' : 'Be the first to bid on this project'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 p-8">
                        {filteredBids.map((bid) => (
                            <ProposalCard 
                                key={bid.id} 
                                proposal={{
                                    ...bid,
                                    freelancerName: bid.freelancerName || 'Freelancer',
                                    freelancerTitle: 'Professional Freelancer', // Or fetch actual title if available
                                }} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectProposals;
