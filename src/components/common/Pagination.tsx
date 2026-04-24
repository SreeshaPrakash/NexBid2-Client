import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const getPageNumbers = () => {
        const pages = [];
        const showMax = 5;
        
        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            const end = Math.min(totalPages, start + showMax - 1);
            
            if (end === totalPages) {
                start = Math.max(1, end - showMax + 1);
            }
            
            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 mb-8 gap-4 px-2">
            <p className="text-sm text-slate-400 order-2 sm:order-1">
                Showing <span className="text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="text-white font-bold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                <span className="text-white font-bold">{totalItems}</span> projects
            </p>

            <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 rounded-xl font-bold transition-all ${
                                currentPage === page
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
