import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit3, ShieldCheck } from 'lucide-react';
import { getClientProfile } from '../../services/clientService';
import toast from 'react-hot-toast';
import type { ClientProfileDTO } from '../../types/client.dto';
import { ClientRoute, UserRoute } from '../../constants/routeConstansts';


const ClientProfile: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ClientProfileDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getClientProfile();
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
    }, []);

    if (loading) {
        return (
            <div className="w-full">
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-700 border-t-transparent"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="w-full pt-[100px]">
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex-grow flex items-center justify-center p-6">
                        <div className="bg-[#111118] p-8 rounded-2xl shadow-xl border border-white/5 text-center max-w-md w-full">
                            <h2 className="text-xl font-bold text-white mb-4">Profile Not Found</h2>
                            <button
                                onClick={() => navigate(UserRoute.HOME)}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all active:scale-95"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="w-full">
            <main className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Simplified Professional Profile Header */}
                    <div className="bg-[#111118] rounded-[2rem] border border-white/5 shadow-sm overflow-hidden mb-6">
                        <div className="py-6 px-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                            {/* Profile Image */}
                            <div className="h-32 w-32 rounded-2xl bg-white/5 border border-white/5 shadow-inner overflow-hidden flex items-center justify-center shrink-0">
                                {profile.profileImage ? (
                                    <img src={profile.profileImage} alt={profile.name} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-16 w-16 text-slate-600" />
                                )}
                            </div>

                            {/* Essential Info */}
                            <div className="flex-grow text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/5 text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/5 mb-3">
                                            <ShieldCheck className="h-3 w-3" />
                                            Verified Client
                                        </div>
                                        <h1 className="text-3xl font-bold text-white mb-1">{profile.name}</h1>
                                        <p className="text-slate-400 font-medium">{profile.email}</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/${ClientRoute.PROFILE_EDIT}`)}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 border border-white/10 transition-all active:scale-95 text-sm"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simple Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#111118] p-6 rounded-2xl border border-white/5 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-indigo-400" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-tight mb-0.5">Email</p>
                                        <p className="text-white font-bold text-sm">{profile.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-indigo-400" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-tight mb-0.5">Phone</p>
                                        <p className="text-white font-bold text-sm">{profile.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#111118] p-6 rounded-2xl border border-white/5 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Location Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-indigo-400" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-tight mb-0.5">Country</p>
                                        <p className="text-white font-bold text-sm">{profile.country || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-indigo-400" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-tight mb-0.5">State / Region</p>
                                        <p className="text-white font-bold text-sm">{profile.state || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientProfile;

