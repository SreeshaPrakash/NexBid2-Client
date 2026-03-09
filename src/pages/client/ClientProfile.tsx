import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit3, ShieldCheck } from 'lucide-react';
import { getClientProfile } from '../../services/clientService';
import toast from 'react-hot-toast';
import type { ClientProfileDTO } from '../../types/client.dto';

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
            <div className="w-full">
                <main className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-900 border-t-transparent"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="w-full">
                <main className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex-grow flex items-center justify-center p-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
                            <button
                                onClick={() => navigate('/home')}
                                className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all"
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
            <main className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Simplified Professional Profile Header */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                            {/* Profile Image */}
                            <div className="h-32 w-32 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner overflow-hidden flex items-center justify-center shrink-0">
                                {profile.profileImage ? (
                                    <img src={profile.profileImage} alt={profile.name} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-16 w-16 text-slate-300" />
                                )}
                            </div>

                            {/* Essential Info */}
                            <div className="flex-grow text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-50 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-100 mb-3">
                                            <ShieldCheck className="h-3 w-3" />
                                            Verified Client
                                        </div>
                                        <h1 className="text-3xl font-bold text-slate-900 mb-1">{profile.name}</h1>
                                        <p className="text-slate-500 font-medium">{profile.email}</p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/client/profile/edit')}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 text-sm"
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
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Email</p>
                                        <p className="text-slate-900 font-semibold">{profile.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Phone</p>
                                        <p className="text-slate-900 font-semibold">{profile.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Location Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Country</p>
                                        <p className="text-slate-900 font-semibold">{profile.country || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">State / Region</p>
                                        <p className="text-slate-900 font-semibold">{profile.state || 'Not provided'}</p>
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

