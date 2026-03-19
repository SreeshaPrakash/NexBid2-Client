import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, CheckCircle, Globe, Link as LinkIcon, BookOpen, Mail, Phone, ExternalLink, X, Eye, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { getProfile, requestVerification } from '../../services/freelancerService';
import toast from 'react-hot-toast';

const FreelancerProfile: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [requestingVerification, setRequestingVerification] = useState(false);
    const [viewingImage, setViewingImage] = useState<string | null>(null);

    const isVideo = (url: string) => {
        return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
    };

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

    const handleRequestVerification = async () => {
        try {
            setRequestingVerification(true);
            const response = await requestVerification();
            if (response.success) {
                toast.success('Verification request submitted successfully!');
                setProfile({ ...profile, verificationStatus: 'pending' });
            } else {
                toast.error(response.message || 'Failed to request verification');
            }
        } catch (error: any) {
            console.error('Error requesting verification:', error);
            toast.error(error.response?.data?.message || 'Error requesting verification');
        } finally {
            setRequestingVerification(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-transparent"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex-grow flex items-center justify-center p-6 pt-[100px]">
                <div className="bg-[#111118] p-10 rounded-3xl shadow-xl border border-white/5 text-center max-w-md w-full">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="h-10 w-10 text-slate-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Profile Not Found</h2>
                        <p className="text-slate-400 mb-8 font-medium">You haven't set up your professional freelancer profile yet.</p>
                        <button 
                            onClick={() => navigate('/freelancer/profile/setup')}
                            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-900/20"
                        >
                            Setup Your Profile
                        </button>
                    </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <main className="max-w-6xl mx-auto w-full pt-[100px] pb-16 px-4 sm:px-6 lg:px-8">
                {/* TIER 1: Header (Photo + Main Data) */}
                <div className="bg-[#111118] rounded-[2rem] py-6 px-10 shadow-sm border border-white/5 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                        {/* Circle Profile Photo */}
                        <div className="relative shrink-0">
                            <div 
                                className={`h-36 w-36 md:h-40 md:w-40 rounded-full ring-4 ring-white/5 p-1 bg-[#181820] overflow-hidden shadow-inner group ${profile.profileImage ? 'cursor-pointer relative' : ''}`}
                                onClick={() => { if (profile.profileImage) setViewingImage(profile.profileImage); }}
                            >
                                {profile.profileImage ? (
                                    <>
                                        <img src={profile.profileImage} alt={profile.name} className="h-full w-full object-cover rounded-full" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full pointer-events-none">
                                            <Eye className="h-8 w-8 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full w-full bg-[#181820] flex items-center justify-center rounded-full">
                                        <User className="h-16 w-16 text-slate-600" />
                                    </div>
                                )}
                            </div>
                            {profile.verificationStatus === 'verified' && (
                                <div className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg border-4 border-white">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                            )}
                        </div>

                        {/* Main Field Data */}
                        <div className="flex-grow text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
                                        {profile.name || 'Professional User'}
                                    </h1>
                                    <h2 className="text-lg font-bold text-indigo-400 mb-3">{profile.title}</h2>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider">
                                            <Globe className="h-3.5 w-3.5 text-indigo-400" />
                                            {profile.state}{profile.state && profile.country ? ', ' : ''}{profile.country}
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 font-bold text-xs">
                                            <Mail className="h-3.5 w-3.5 text-indigo-400" />
                                            {profile.email}
                                        </div>
                                        {profile.phone && (
                                            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 font-bold text-xs">
                                                <Phone className="h-3.5 w-3.5 text-indigo-400" />
                                                {profile.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => navigate('/freelancer/profile/edit')}
                                        className="px-6 py-2.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 border border-white/10 transition-all active:scale-95 shadow-lg"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>

                            {/* Main Stats Card */}
                            <div className="grid grid-cols-3 gap-6 bg-white/5 p-5 rounded-2xl border border-white/5">
                                <div className="text-center md:text-left border-r border-white/10">
                                    <span className="block text-xl font-black text-white leading-none mb-1">{profile.completedProjects || 0}</span>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Completed</span>
                                </div>
                                <div className="text-center md:text-left border-r border-white/10">
                                    <span className="block text-xl font-black text-white leading-none mb-1">{profile.experienceInYears || 0}</span>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Experience</span>
                                </div>
                                <div className="text-center md:text-left">
                                    <span className="block text-xl font-black text-white leading-none mb-1">₹{profile.hourlyRate || 0}</span>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Rate / hr</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Status Banner */}
                {(!profile.verificationStatus || profile.verificationStatus === 'unverified' || profile.verificationStatus === 'rejected') && (
                    <div className="bg-[#111118] rounded-[2rem] p-8 shadow-sm border border-white/5 mb-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-start gap-5">
                                <div className={`p-4 rounded-2xl ${profile.verificationStatus === 'rejected' ? 'bg-red-500/10' : 'bg-indigo-500/10'}`}>
                                    <ShieldCheck className={`h-8 w-8 ${profile.verificationStatus === 'rejected' ? 'text-red-400' : 'text-indigo-400'}`} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {profile.verificationStatus === 'rejected' ? 'Verification Denied' : 'Professional Verification'}
                                    </h3>
                                    <p className="text-slate-400 text-sm max-w-xl">
                                        {profile.verificationStatus === 'rejected' 
                                            ? <><span className="text-red-400 font-medium">Reason: </span>{profile.rejectionReason || 'Your profile did not meet the guidelines at this time.'}</>
                                            : 'Get a verified badge to build trust with clients and stand out from the crowd. Our team will review your profile details.'
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleRequestVerification}
                                disabled={requestingVerification}
                                className={`px-8 py-3.5 font-bold rounded-xl transition-all shadow-lg shrink-0 flex items-center gap-2 ${
                                    profile.verificationStatus === 'rejected'
                                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10 active:scale-95'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-indigo-900/20'
                                }`}
                            >
                                {requestingVerification ? (
                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                ) : profile.verificationStatus === 'rejected' ? (
                                    <RefreshCw className="h-5 w-5" />
                                ) : (
                                    <ShieldCheck className="h-5 w-5" />
                                )}
                                {requestingVerification ? 'Submitting...' : profile.verificationStatus === 'rejected' ? 'Re-apply Now' : 'Request Verification'}
                            </button>
                        </div>
                    </div>
                )}

                {profile.verificationStatus === 'pending' && (
                    <div className="bg-amber-500/10 rounded-[2rem] p-8 border border-amber-500/20 mb-6 flex items-start gap-5">
                        <Clock className="h-8 w-8 text-amber-500 shrink-0" />
                        <div>
                            <h3 className="text-amber-500 font-bold text-xl mb-2">Verification Processing</h3>
                            <p className="text-amber-500/80 text-sm max-w-xl">Your profile is currently under review by our admin team. You'll be notified here once a decision is made.</p>
                        </div>
                    </div>
                )}

                {/* TIER 2: Mid-Section (Remaining Field Datas) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                    <div className="lg:col-span-8 bg-[#111118] rounded-[2rem] py-8 px-10 shadow-sm border border-white/5">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                            <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                            Professional Narrative
                        </h3>
                        <p className="text-slate-300 font-medium leading-[1.8] text-base whitespace-pre-line">
                            {profile.bio}
                        </p>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        {/* Skills Tag Cloud */}
                        <div className="bg-[#111118] rounded-[2rem] p-8 shadow-sm border border-white/5">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills?.map((skill: string, index: number) => (
                                    <span key={index} className="px-3 py-1.5 bg-white/5 text-slate-300 rounded-lg text-[10px] font-bold border border-white/5">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Network Links */}
                        <div className="bg-[#111118] rounded-[2rem] p-8 shadow-sm border border-white/5">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Connect</h3>
                            <div className="flex flex-col gap-3">
                                {profile.portfolio && (
                                    <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500 transition-colors">
                                                <LinkIcon className="h-3.5 w-3.5 text-indigo-400 group-hover:text-white" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-300">Portfolio</span>
                                        </div>
                                        <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                                    </a>
                                )}
                                {profile.gitHubUrl && (
                                    <a href={profile.gitHubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-indigo-500 transition-colors">
                                                <BookOpen className="h-3.5 w-3.5 text-white" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-300">GitHub</span>
                                        </div>
                                        <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                                    </a>
                                )}
                                {profile.linkedinUrl && (
                                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-600/20 rounded-lg group-hover:bg-indigo-500 transition-colors">
                                                <Briefcase className="h-3.5 w-3.5 text-blue-400 group-hover:text-white" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-300">LinkedIn</span>
                                        </div>
                                        <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* TIER 3: Footer Section (Previous Works) */}
                <div className="bg-[#111118] rounded-[2rem] py-8 px-10 shadow-sm border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white tracking-tight">Previous Works</h3>
                        <div className="h-px flex-grow mx-6 bg-white/10 rounded-full"></div>
                    </div>

                    {profile.previousWorks && profile.previousWorks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {profile.previousWorks.map((media: string, index: number) => (
                                <div 
                                    key={index} 
                                    className="group relative aspect-video bg-[#181820] rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all duration-500 cursor-pointer"
                                    onClick={() => setViewingImage(media)}
                                >
                                    {isVideo(media) ? (
                                        <video 
                                            src={media} 
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                                            muted
                                        />
                                    ) : (
                                        <img 
                                            src={media} 
                                            alt={`Work ${index + 1}`} 
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-white font-bold text-[10px] uppercase tracking-widest scale-90 group-hover:scale-100 transition-transform flex items-center gap-2">
                                            <Eye className="h-3.5 w-3.5" />
                                            View Image
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white/5 rounded-[2rem] border-2 border-dashed border-white/10">
                            <Briefcase className="h-10 w-10 text-slate-500 mx-auto mb-4" />
                            <h4 className="text-base font-bold text-white mb-2">No Previous Projects Yet</h4>
                            <p className="text-slate-400 font-medium mb-6 text-sm">Your professional portfolio is ready for your first masterpiece.</p>
                            <button 
                                onClick={() => navigate('/freelancer/profile/edit')}
                                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all active:scale-95 shadow-lg"
                            >
                                Update Portfolio
                            </button>
                        </div>
                    )}
                </div>
            </main>
            
            {/* Image Viewing Modal */}
            {viewingImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                    onClick={() => setViewingImage(null)}
                >
                    <button
                        onClick={() => setViewingImage(null)}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[101]"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    {viewingImage && isVideo(viewingImage) ? (
                        <video 
                            src={viewingImage} 
                            controls
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
                            onClick={(e) => e.stopPropagation()} 
                        />
                    ) : (
                        <img 
                            src={viewingImage} 
                            alt="Enlarged view" 
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
                            onClick={(e) => e.stopPropagation()} 
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default FreelancerProfile;
