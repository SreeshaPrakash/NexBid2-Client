import React from 'react';
import { IndianRupee, Clock, MessageSquare, User } from 'lucide-react';

export interface ProposalData {
    id: string;
    freelancerName: string;
    freelancerTitle: string;
    bidAmount: number;
    deliveryTime: number;
    message: string;
    status: string;
    createdAt: string;
}

interface ProposalCardProps {
    proposal: ProposalData;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
    return (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 space-y-5 group">
            {/* Header: Freelancer Info + Amount */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0 border border-white/5">
                        <User className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">{proposal.freelancerName}</p>
                        <p className="text-slate-500 text-xs font-medium">{proposal.freelancerTitle}</p>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                        <IndianRupee className="h-4 w-4 text-emerald-400" />
                        <p className="text-xl font-black text-white">{proposal.bidAmount.toLocaleString()}</p>
                    </div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                        Bid Amount
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 py-3 px-4 bg-white/[0.02] rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <span className="text-white text-sm font-bold">{proposal.deliveryTime} days</span>
                    <span className="text-slate-600 text-xs">delivery</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">
                        Submitted {new Date(proposal.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>

            {/* Cover Letter */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Cover Letter</p>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                    {proposal.message}
                </p>
            </div>
        </div>
    );
};

export default ProposalCard;
