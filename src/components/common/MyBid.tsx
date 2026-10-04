import React, { useState, useEffect } from 'react';
import { IndianRupee, Clock, MessageSquare, Pencil, Trash2, X, Send, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bidSchema } from '../../validations/zodSchemas';
import type { Bid } from '../../redux/slices/bid/bidSlice';

interface MyBidProps {
    bid: Bid | null;
    isProjectOpen: boolean;
    onUpdate?: (bidId: string, data: { bidAmount: number; deliveryTime: number; message: string }) => Promise<void>;
    onWithdraw?: (bidId: string) => Promise<void>;
    loading?: boolean;
}

const MyBid: React.FC<MyBidProps> = ({ bid, isProjectOpen, onUpdate, onWithdraw, loading = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(bidSchema),
        defaultValues: {
            bidAmount: bid?.bidAmount || 0,
            deliveryTime: bid?.deliveryTime || 0,
            message: bid?.message || ''
        }
    });

    // Update form when bid changes or editing starts
    useEffect(() => {
        if (bid && isEditing) {
            reset({
                bidAmount: bid.bidAmount,
                deliveryTime: bid.deliveryTime,
                message: bid.message
            });
        }
    }, [bid, isEditing, reset]);

    const handleEditSubmit = async (data: any) => {
        if (bid && onUpdate) {
            await onUpdate(bid.id, data);
            setIsEditing(false);
        }
    };

    const handleWithdraw = async () => {
        if (bid && onWithdraw) {
            await onWithdraw(bid.id);
        }
    };

    // No bid submitted
    if (!bid) {
        return (
            <div className="bg-[#111118] rounded-[2.5rem] border border-white/5 p-8 md:p-12 shadow-2xl">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">My Bid</h2>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                        <AlertCircle className="h-8 w-8 text-slate-600" />
                    </div>
                    <p className="text-slate-500 font-medium text-sm">You have not submitted any bid yet</p>
                    <p className="text-slate-600 text-xs mt-1">Use the "Place a Bid" button to submit your proposal</p>
                </div>
            </div>
        );
    }

    // Bid is withdrawn
    if (bid.status === 'withdrawn') {
        return (
            <div className="bg-[#111118] rounded-[2.5rem] border border-white/5 p-8 md:p-12 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">My Bid</h2>
                    <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase tracking-widest">
                        Withdrawn
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-slate-500 font-medium text-sm">You have withdrawn your bid from this project</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#111118] rounded-[2.5rem] border border-white/5 p-8 md:p-12 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">My Bid</h2>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest">
                    Active
                </span>
            </div>

            {/* Edit Mode */}
            {isEditing ? (
                <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-5" noValidate>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <IndianRupee className="h-3 w-3" />
                            Bid Amount (₹)
                        </label>
                        <input
                            {...register('bidAmount', { valueAsNumber: true })}
                            type="number"
                            className={`w-full bg-white/5 border ${errors.bidAmount ? 'border-rose-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm`}
                        />
                        {errors.bidAmount && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.bidAmount.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Clock className="h-3 w-3" />
                            Delivery Time (Days)
                        </label>
                        <input
                            {...register('deliveryTime', { valueAsNumber: true })}
                            type="number"
                            className={`w-full bg-white/5 border ${errors.deliveryTime ? 'border-rose-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm`}
                        />
                        {errors.deliveryTime && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.deliveryTime.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <MessageSquare className="h-3 w-3" />
                            Cover Letter
                        </label>
                        <textarea
                            {...register('message')}
                            rows={4}
                            className={`w-full bg-white/5 border ${errors.message ? 'border-rose-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none text-sm`}
                        />
                        {errors.message && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.message.message as string}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-5 py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold rounded-xl transition-all border border-white/5 text-sm"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    {/* Display Mode */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <IndianRupee className="h-4 w-4 text-emerald-400" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bid Amount</p>
                            </div>
                            <p className="text-2xl font-black text-white">₹{bid.bidAmount.toLocaleString()}</p>
                        </div>

                        <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-amber-400" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Delivery</p>
                            </div>
                            <p className="text-2xl font-black text-white">{bid.deliveryTime} <span className="text-sm font-bold text-slate-500">days</span></p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <MessageSquare className="h-4 w-4 text-indigo-400" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cover Letter</p>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-white/[0.02] rounded-2xl border border-white/5 p-5">
                            {bid.message}
                        </p>
                    </div>

                    {/* Action Buttons — Only if project is still open */}
                    {isProjectOpen && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                            >
                                <Pencil className="h-4 w-4 text-indigo-400" />
                                Edit Bid
                            </button>
                            <button
                                onClick={handleWithdraw}
                                disabled={loading}
                                className="flex-1 py-3.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                Withdraw Bid
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyBid;
