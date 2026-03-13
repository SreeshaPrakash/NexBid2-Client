import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#111118] border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 text-white p-2.5 rounded-xl border border-white/5">
                        <span className="font-extrabold text-sm tracking-tighter">N</span>
                    </div>
                    <span className="text-xl font-extrabold text-white tracking-tight">NexBid</span>
                </div>
                
                <div className="flex items-center gap-8">
                    <a href="#" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all">Terms</a>
                    <a href="#" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all">Privacy</a>
                    <a href="#" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all">Support</a>
                </div>

                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">
                    © 2024 NexBid • Excellence in Remote Work
                </div>
            </div>
        </footer>
    );
};

export default Footer;
