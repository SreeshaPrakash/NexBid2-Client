import React from 'react';
import { X, IndianRupee, Clock, MessageSquare, Send, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bidSchema } from '../../validations/zodSchemas';

interface PlaceBidModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { bidAmount: number; deliveryTime: number; message: string }) => Promise<void>;
    projectTitle: string;
    projectBudget: number;
    isSubmitting?: boolean;
}

const PlaceBidModal: React.FC<PlaceBidModalProps> = ({ isOpen, onClose, onSubmit, projectTitle, projectBudget, isSubmitting = false }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(bidSchema),
        defaultValues: {
            bidAmount: 0,
            deliveryTime: 0,
            message: ''
        }
    });

    if (!isOpen) return null;

    const handleFormSubmit = async (data: any) => {
        await onSubmit(data);
        reset();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-[#111118] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Gradient accent line */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-0">
                    <div>
                        <h2 className="text-xl font-black text-white">Place Your Bid</h2>
                        <p className="text-slate-500 text-xs mt-1 max-w-[300px] truncate">
                            For: {projectTitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group"
                    >
                        <X className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Budget Reference */}
                <div className="mx-6 mt-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <IndianRupee className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Client Budget</p>
                        <p className="text-emerald-400 font-bold text-sm">₹{projectBudget.toLocaleString()}</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5" noValidate>
                    {/* Bid Amount */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <IndianRupee className="h-3 w-3" />
                            Your Bid Amount (₹)
                        </label>
                        <input
                            {...register('bidAmount', { valueAsNumber: true })}
                            type="number"
                            placeholder="e.g. 5000"
                            className={`w-full bg-white/5 border ${errors.bidAmount ? 'border-rose-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm`}
                        />
                        {errors.bidAmount && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.bidAmount.message as string}</p>}
                    </div>

                    {/* Delivery Time */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Clock className="h-3 w-3" />
                            Delivery Time (Days)
                        </label>
                        <input
                            {...register('deliveryTime', { valueAsNumber: true })}
                            type="number"
                            placeholder="e.g. 7"
                            className={`w-full bg-white/5 border ${errors.deliveryTime ? 'border-rose-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm`}
                        />
                        {errors.deliveryTime && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.deliveryTime.message as string}</p>}
                    </div>

                    {/* Cover Letter */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <MessageSquare className="h-3 w-3" />
                            Cover Letter
                        </label>
                        <textarea
                            {...register('message')}
                            placeholder="Describe why you're the best fit for this project..."
                            rows={4}
                            className={`w-full bg-white/5 border ${errors.message ? 'border-rose-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none text-sm`}
                        />
                        {errors.message && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.message.message as string}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold rounded-xl transition-all border border-white/5 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlaceBidModal;
