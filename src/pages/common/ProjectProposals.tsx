import React from 'react';
import { Users, Search } from 'lucide-react';
import { useAppSelector } from '../../redux/hooks';

const ProjectProposals: React.FC = () => {
    const { activeRole } = useAppSelector((state) => state.auth);

    return (
        <div className="space-y-8">
            {/* 1. Your Proposal Section (Visible to Freelancers) */}
            {activeRole === 'freelancer' && (
                <div className="bg-[#111118] rounded-[2rem] border border-white/5 p-8 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6">
                        <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Your Proposal
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                            <Users className="h-8 w-8 text-indigo-400" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-white">Review Your Submission</h2>
                            <p className="text-slate-500 text-sm max-w-md">
                                You have not submitted a proposal for this project yet. Use the "Details" tab to place a bid.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. All Proposals Section */}
            <div className="bg-[#111118] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-white">All Proposals</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Total of 0 proposals submitted</p>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Filter candidates..." 
                            className="bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all w-full sm:w-64"
                        />
                    </div>
                </div>

                <div className="p-12 text-center h-[300px] flex flex-col items-center justify-center">
                    <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                        <Users className="h-10 w-10 text-slate-700" />
                    </div>
                    <p className="text-slate-500 font-medium">Bidding system integration soon...</p>
                    <p className="text-slate-600 text-xs mt-2 uppercase tracking-widest font-black">No proposals to display</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectProposals;
