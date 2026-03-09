import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, CheckCircle, Globe, Link as LinkIcon, BookOpen, Mail, Phone, ExternalLink } from 'lucide-react';
import { getProfile } from '../../services/freelancerService';
import toast from 'react-hot-toast';

const FreelancerProfile: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                if (response.success) {
                    setProfile(response.data);
                } else {
                    toast.error(response.message || 'Failed to fetch profile');
                }
            } catch (error: any) {
                console.error('Error fetching profile:', error);
                toast.error(error.response?.data?.message || 'Error fetching profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex-grow flex items-center justify-center p-6">
                <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 text-center max-w-md w-full">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="h-10 w-10 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Profile Not Found</h2>
                        <p className="text-slate-500 mb-8 font-medium">You haven't set up your professional freelancer profile yet.</p>
                        <button 
                            onClick={() => navigate('/freelancer/profile/setup')}
                            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                        >
                            Setup Your Profile
                        </button>
                    </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <main className="max-w-6xl mx-auto w-full pt-12 pb-24 px-4 sm:px-6 lg:px-8">
                {/* TIER 1: Header (Photo + Main Data) */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16">
                        {/* Circle Profile Photo */}
                        <div className="relative shrink-0">
                            <div className="h-40 w-40 md:h-48 md:w-48 rounded-full ring-8 ring-slate-50 p-1 bg-white overflow-hidden shadow-inner">
                                {profile.profileImage ? (
                                    <img src={profile.profileImage} alt={profile.name} className="h-full w-full object-cover rounded-full" />
                                ) : (
                                    <div className="h-full w-full bg-slate-50 flex items-center justify-center rounded-full">
                                        <User className="h-20 w-20 text-slate-200" />
                                    </div>
                                )}
                            </div>
                            {profile.status === 'verified' && (
                                <div className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg border-4 border-white">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                            )}
                        </div>

                        {/* Main Field Data */}
                        <div className="flex-grow text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                                        {profile.name || 'Professional User'}
                                    </h1>
                                    <h2 className="text-xl font-bold text-indigo-600 mb-4">{profile.title}</h2>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-900 font-bold text-sm">
                                            <Globe className="h-4 w-4 text-slate-900" />
                                            {profile.state}{profile.state && profile.country ? ', ' : ''}{profile.country}
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-900 font-bold text-sm">
                                            <Mail className="h-4 w-4 text-slate-900" />
                                            {profile.email}
                                        </div>
                                        {profile.phone && (
                                            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-900 font-bold text-sm">
                                                <Phone className="h-4 w-4 text-slate-900" />
                                                {profile.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => navigate('/freelancer/profile/edit')}
                                        className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>

                            {/* Main Stats Card */}
                            <div className="grid grid-cols-3 gap-8 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                                <div className="text-center md:text-left border-r border-slate-200">
                                    <span className="block text-2xl font-black text-slate-900 leading-none mb-1">{profile.completedProjects || 0}</span>
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Completed</span>
                                </div>
                                <div className="text-center md:text-left border-r border-slate-200">
                                    <span className="block text-2xl font-black text-slate-900 leading-none mb-1">{profile.experienceInYears || 0}</span>
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Experience</span>
                                </div>
                                <div className="text-center md:text-left">
                                    <span className="block text-2xl font-black text-slate-900 leading-none mb-1">₹{profile.hourlyRate || 0}</span>
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Rate / hr</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TIER 2: Mid-Section (Remaining Field Datas) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                    <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                            <BookOpen className="h-4 w-4 text-indigo-500" />
                            Professional Narrative
                        </h3>
                        <p className="text-slate-900 font-medium leading-[1.8] text-lg whitespace-pre-line">
                            {profile.bio}
                        </p>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        {/* Skills Tag Cloud */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills?.map((skill: string, index: number) => (
                                    <span key={index} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Network Links */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Connect</h3>
                            <div className="flex flex-col gap-4">
                                {profile.portfolio && (
                                    <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-600 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 transition-colors">
                                                <LinkIcon className="h-4 w-4 text-indigo-600 group-hover:text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">Portfolio</span>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-slate-900" />
                                    </a>
                                )}
                                {profile.gitHubUrl && (
                                    <a href={profile.gitHubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-600 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-indigo-600 transition-colors">
                                                <BookOpen className="h-4 w-4 text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">GitHub</span>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-slate-900" />
                                    </a>
                                )}
                                {profile.linkedinUrl && (
                                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-600 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-indigo-600 transition-colors">
                                                <Briefcase className="h-4 w-4 text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">LinkedIn</span>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-slate-900" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* TIER 3: Footer Section (Previous Works) */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Previous Works</h3>
                        <div className="h-1 flex-grow mx-8 bg-slate-900/10 rounded-full"></div>
                    </div>

                    {profile.previousWorks && profile.previousWorks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {profile.previousWorks.map((media: string, index: number) => (
                                <div key={index} className="group relative aspect-[4/3] bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-500">
                                    <img 
                                        src={media} 
                                        alt={`Work ${index + 1}`} 
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                    />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white font-bold text-sm scale-90 group-hover:scale-100 transition-transform">
                                            View Project
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                            <Briefcase className="h-12 w-12 text-slate-900 mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-slate-900 mb-2">No Previous Projects Yet</h4>
                            <p className="text-slate-900 font-medium mb-8">Your professional portfolio is ready for your first masterpiece.</p>
                            <button 
                                onClick={() => navigate('/freelancer/profile/edit')}
                                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95"
                            >
                                Update Portfolio
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FreelancerProfile;
