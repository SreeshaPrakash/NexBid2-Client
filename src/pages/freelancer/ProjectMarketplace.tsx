import React, { useEffect } from 'react';
import { Search, Filter, Briefcase, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchOpenProjects, clearError } from '../../redux/slices/project/projectSlice';
import ProjectListView from '../../components/project/ProjectListView';
import debounce from 'lodash.debounce';

const ProjectMarketplace: React.FC = () => {
    const dispatch = useAppDispatch();
    const { projects, loading } = useAppSelector((state) => state.project);

    const [searchTerm, setSearchTerm] = React.useState('');

    // Create a debounced dispatch function
    const debouncedFetch = React.useMemo(
        () => debounce((query: string) => dispatch(fetchOpenProjects(query)), 500),
        [dispatch]
    );

    useEffect(() => {
        dispatch(clearError());
        dispatch(fetchOpenProjects('')); // Initial load without search

        // Cleanup debounce on unmount
        return () => debouncedFetch.cancel();
    }, [dispatch, debouncedFetch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchTerm(query);
        debouncedFetch(query);
    };

    return (
        <div className="w-full">
            <main className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
                                <Briefcase className="h-3 w-3" />
                                <span>Marketplace</span>
                                <ChevronRight className="h-3 w-3" />
                                <span className="text-white">Browse Projects</span>
                            </div>
                            <h1 className="text-4xl font-black text-white mb-2 italic tracking-tight uppercase">Project Marketplace</h1>
                            <p className="text-slate-400 font-medium">Find your next big opportunity. Browse and bid on open projects.</p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-grow md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full bg-[#111118] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-text"
                                />
                            </div>
                            <button className="p-3 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95">
                                <Filter className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <ProjectListView
                        projects={projects}
                        loading={loading}
                        emptyMessage="No open projects found at the moment. Please check back later!"
                    />
                </div>
            </main>
        </div>
    );
};

export default ProjectMarketplace;
