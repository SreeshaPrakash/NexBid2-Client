import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { User, ShieldCheck, ArrowLeft, Mail, Phone, Globe, Briefcase, BookOpen, Clock, CheckCircle, ExternalLink, Link as LinkIcon, Eye, X } from 'lucide-react';
import { getAdminFreelancerProfile } from '../../services/adminService';
import toast from 'react-hot-toast';
import type { FreelancerProfileDTO } from '../../types/freelancer.dto';

const AdminFreelancerProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<FreelancerProfileDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [viewingImage, setViewingImage] = useState<string | null>(null);

    const fromTab = searchParams.get('from') || 'verifications';

    const isVideo = (url: string) => {
        return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) return;
            try {
                const response = await getAdminFreelancerProfile(id);
                if (response.success) {
                    setProfile(response.data);
                } else {
                    toast.error(response.message || 'Failed to fetch profile');
                }
            } catch (error: unknown) {
                console.error('Error fetching profile:', error);
                const err = error as { response?: { data?: { message?: string } } };
                toast.error(err.response?.data?.message || 'Error fetching profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="h-10 w-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Profile Not Found</h2>
                    <p className="text-gray-500 mb-8 font-medium">This freelancer profile could not be retrieved or doesn't exist.</p>
                    <button 
                        onClick={() => navigate(`/admin/dashboard?tab=${fromTab}`)}
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <button
                        onClick={() => navigate(`/admin/dashboard?tab=${fromTab}`)}
                        className="flex items-center text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Admin Dashboard
                    </button>
                    <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
                        <ShieldCheck className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Verification Review Mode</span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-[2rem] py-10 px-10 shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                        {/* Profile Image */}
                        <div className="relative shrink-0">
                            <div 
                                className={`h-40 w-40 rounded-full ring-4 ring-gray-50 p-1 bg-gray-50 overflow-hidden shadow-inner group ${profile.profileImage ? 'cursor-pointer relative' : ''}`}
                                onClick={() => { if (profile.profileImage) setViewingImage(profile.profileImage); }}
                            >
                                {profile.profileImage ? (
                                    <>
                                        <img src={profile.profileImage} alt={profile.name} className="h-full w-full object-cover rounded-full" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full pointer-events-none">
                                            <Eye className="h-8 w-8 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded-full">
                                        <User className="h-20 w-20 text-gray-300" />
                                    </div>
                                )}
                            </div>
                            {profile.verificationStatus === 'verified' && (
                                <div className="absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="flex-grow text-center md:text-left">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                                {profile.name}
                            </h1>
                            <h2 className="text-xl font-bold text-indigo-600 mb-6">{profile.title}</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600 font-bold text-sm">
                                    <Mail className="h-4 w-4 text-indigo-600" />
                                    {profile.email}
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600 font-bold text-sm">
                                    <Globe className="h-4 w-4 text-indigo-600" />
                                    {profile.state}, {profile.country}
                                </div>
                                {profile.phone && (
                                    <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600 font-bold text-sm">
                                        <Phone className="h-4 w-4 text-indigo-600" />
                                        {profile.phone}
                                    </div>
                                )}
                                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600 font-bold text-sm">
                                    <Clock className="h-4 w-4 text-indigo-600" />
                                    Joined {new Date(profile.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <div className="text-center md:text-left border-r border-gray-200">
                                    <span className="block text-2xl font-black text-gray-900 leading-none mb-1">{profile.completedProjects || 0}</span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completed</span>
                                </div>
                                <div className="text-center md:text-left">
                                    <span className="block text-2xl font-black text-gray-900 leading-none mb-1">{profile.experienceInYears || 0}y</span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white rounded-[2rem] py-10 px-10 shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-indigo-600" />
                                Professional Bio
                            </h3>
                            <p className="text-gray-700 font-medium leading-[1.8] text-lg whitespace-pre-line">
                                {profile.bio}
                            </p>
                        </div>

                        <div className="bg-white rounded-[2rem] py-10 px-10 shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <Briefcase className="h-4 w-4 text-indigo-600" />
                                Detailed Experience
                            </h3>
                            <div className="space-y-6">
                                {profile.experiences && profile.experiences.length > 0 ? (
                                    profile.experiences.map((exp, index) => (
                                        <div key={index} className="p-6 bg-gray-50 border border-gray-100 rounded-2xl">
                                            <h4 className="text-gray-900 font-bold text-lg mb-2">{exp.title}</h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 italic text-sm">No detailed experience provided.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        {/* Skills */}
                        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Top Expertise</h3>
                            <div className="flex flex-wrap gap-3">
                                {profile.skills?.map((skill, index) => (
                                    <span key={index} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-100/50">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Documented Links */}
                        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Provided Links</h3>
                            <div className="flex flex-col gap-4">
                                {profile.portfolio && (
                                    <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-500/50 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-indigo-100 rounded-xl group-hover:bg-indigo-600 transition-colors">
                                                <LinkIcon className="h-4 w-4 text-indigo-600 group-hover:text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">Live Portfolio</span>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-gray-400" />
                                    </a>
                                )}
                                {profile.gitHubUrl && (
                                    <a href={profile.gitHubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-500/50 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-gray-800 rounded-xl group-hover:bg-indigo-600 transition-colors">
                                                <Briefcase className="h-4 w-4 text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">GitHub Profile</span>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-gray-400" />
                                    </a>
                                )}
                                {profile.linkedinUrl && (
                                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-500/50 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-blue-100 rounded-xl group-hover:bg-indigo-600 transition-colors">
                                                <LinkIcon className="h-4 w-4 text-blue-600 group-hover:text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">LinkedIn Profile</span>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-gray-400" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Portfolio / Previous Works */}
                <div className="bg-white rounded-[2rem] py-10 px-10 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Portfolio Media</h3>
                        <div className="h-px flex-grow mx-8 bg-gray-100 rounded-full"></div>
                    </div>

                    {profile.previousWorks && profile.previousWorks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {profile.previousWorks.map((media, index) => (
                                <div 
                                    key={index} 
                                    className="group relative aspect-video bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 hover:border-indigo-500/30 transition-all duration-500 cursor-pointer"
                                    onClick={() => setViewingImage(media)}
                                >
                                    {isVideo(media) ? (
                                        <video 
                                            src={media} 
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                            muted
                                        />
                                    ) : (
                                        <img 
                                            src={media} 
                                            alt={`Work ${index + 1}`} 
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl text-white font-bold text-xs uppercase tracking-widest scale-90 group-hover:scale-100 transition-transform flex items-center gap-3">
                                            <Eye className="h-4 w-4" />
                                            Expand View
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-100">
                            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                            <h4 className="text-xl font-bold text-gray-900 mb-2">No Portfolio Items</h4>
                            <p className="text-gray-500 font-medium text-sm">This freelancer has not uploaded any previous work samples yet.</p>
                        </div>
                    )}
                </div>
            </main>
            
            {/* Image Viewer Modal */}
            {viewingImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 backdrop-blur-sm"
                    onClick={() => setViewingImage(null)}
                >
                    <button
                        onClick={() => setViewingImage(null)}
                        className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all z-[101]"
                    >
                        <X className="h-8 w-8" />
                    </button>
                    {viewingImage && isVideo(viewingImage) ? (
                        <video 
                            src={viewingImage} 
                            controls
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" 
                            onClick={(e) => e.stopPropagation()} 
                            autoPlay
                        />
                    ) : (
                        <img 
                            src={viewingImage} 
                            alt="Full viewport view" 
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" 
                            onClick={(e) => e.stopPropagation()} 
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminFreelancerProfile;
