import React, { useState, useEffect } from 'react';
import { Loader2, Briefcase } from 'lucide-react';
import Pagination from './Pagination';

export interface Column<T> {
    header: string;
    accessor?: keyof T;
    render?: (item: T, index: number) => React.ReactNode;
    headerClassName?: string;
    cellClassName?: string;
}

export interface ServerPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    emptyMessage?: React.ReactNode;
    emptyIcon?: React.ReactNode;
    keyExtractor: (item: T) => string;
    onRowClick?: (item: T) => void;
    itemsPerPage?: number;
    theme?: 'light' | 'dark';
    serverPagination?: ServerPaginationProps;
}

export function DataTable<T>({
    data,
    columns,
    loading = false,
    emptyMessage = "No data found.",
    emptyIcon,
    keyExtractor,
    onRowClick,
    itemsPerPage = 10,
    theme = 'dark',
    serverPagination
}: DataTableProps<T>) {
    const isLight = theme === 'light';

    // Client-side pagination state
    const [clientPage, setClientPage] = useState(1);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setClientPage(prev => prev === 1 ? prev : 1);
    }, [data.length]);

    const isServerPaginated = !!serverPagination;

    const currentPage = isServerPaginated ? serverPagination.currentPage : clientPage;
    const totalPages = isServerPaginated
        ? serverPagination.totalPages
        : Math.max(1, Math.ceil(data.length / itemsPerPage));
    const totalItems = isServerPaginated ? (serverPagination.totalItems ?? 0) : data.length;

    const displayData = isServerPaginated
        ? data
        : data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (isServerPaginated) {
            serverPagination.onPageChange(newPage);
        } else {
            setClientPage(newPage);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className={`h-10 w-10 animate-spin mb-4 ${isLight ? 'text-indigo-600' : 'text-indigo-500'}`} />
                <p className={`font-medium ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Loading...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center py-20 ${isLight ? 'bg-white rounded-lg border border-gray-200 shadow-sm' : 'bg-[#111118] rounded-3xl border border-white/5 border-dashed'}`}>
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-4 ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}>
                    {emptyIcon || <Briefcase className={`h-8 w-8 ${isLight ? 'text-gray-400' : 'text-slate-600'}`} />}
                </div>
                <div className={`font-medium text-center ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>
                    {typeof emptyMessage === 'string' ? <p>{emptyMessage}</p> : emptyMessage}
                </div>
            </div>
        );
    }

    const containerClass = isLight
        ? "bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden"
        : "bg-[#111118] rounded-2xl border border-white/5";

    const theadRowClass = isLight ? "bg-gray-50 uppercase" : "border-b border-white/5 bg-white/5 uppercase";
    const thClass = isLight ? "text-gray-500" : "text-slate-400";
    const tbodyClass = isLight ? "bg-white divide-y divide-gray-200" : "divide-y divide-white/5";
    const trClass = isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]";

    return (
        <div className={`w-full overflow-x-auto ${containerClass}`}>
            <table className="w-full text-left border-collapse min-w-full">
                <thead>
                    <tr className={theadRowClass}>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`px-6 py-3 text-xs font-bold tracking-wider ${thClass} ${col.headerClassName || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={tbodyClass}>
                    {displayData.map((item) => (
                        <tr
                            key={keyExtractor(item)}
                            onClick={() => onRowClick?.(item)}
                            className={`${trClass} transition-colors group ${onRowClick ? 'cursor-pointer' : ''}`}
                        >
                            {columns.map((col, index) => (
                                <td key={index} className={`px-6 py-4 whitespace-nowrap ${col.cellClassName || ''}`}>
                                    {col.render
                                        ? col.render(item, index)
                                        : col.accessor ? String(item[col.accessor] as unknown) : null}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {((!isServerPaginated && data.length > 0) || (isServerPaginated && totalItems > 0)) && (
                <div className="px-4 py-2 border-t border-white/5">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
