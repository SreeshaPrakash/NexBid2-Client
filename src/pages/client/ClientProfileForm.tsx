import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save, ArrowLeft, Camera, ShieldCheck } from 'lucide-react';
import { getClientProfile, updateClientProfile } from '../../services/clientService';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/auth/authSlice';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import toast from 'react-hot-toast';
import type { ClientProfileDTO } from '../../types/client.dto';

const ClientProfileForm: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState<ClientProfileDTO>({
        name: '',
        email: '',
        phone: '',
        country: '',
        state: '',
        profileImage: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getClientProfile();
                if (response.success) {
                    setFormData({
                        name: response.data.name || '',
                        email: response.data.email || '',
                        phone: response.data.phone || '',
                        country: response.data.country || '',
                        state: response.data.state || '',
                        profileImage: response.data.profileImage || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setFetching(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await updateClientProfile(formData);
            if (response.success) {
                dispatch(updateUser({ name: formData.name }));
                toast.success('Profile updated successfully');
                navigate('/client/profile');
            } else {
                toast.error(response.message || 'Update failed');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-900 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#fbfcfd]">
            <Navbar />
            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Simple Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <button 
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-bold text-xs uppercase tracking-widest mb-4 group"
                            >
                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                Cancel
                            </button>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Client Profile</h1>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <span className="text-slate-600 font-bold text-xs tracking-tight">Secure Update</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Avatar Section */}
                        <div className="md:col-span-4 space-y-6">
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
                                <div className="relative inline-block mx-auto mb-6">
                                    <div className="h-40 w-40 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center overflow-hidden">
                                        {formData.profileImage ? (
                                            <img src={formData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-20 w-20 text-slate-200" />
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <Camera className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{formData.name}</h3>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{formData.email}</p>
                            </div>
                        </div>

                        {/* Main Fields */}
                        <div className="md:col-span-8 space-y-6">
                            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    {/* Email Field - Disabled */}
                                    <div className="space-y-2 opacity-60">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            disabled
                                            value={formData.email}
                                            className="w-full px-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl outline-none font-semibold text-slate-500 cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Phone Field */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>

                                    <div className="hidden sm:block"></div>

                                    {/* Country Field */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900"
                                            placeholder="United States"
                                        />
                                    </div>

                                    {/* State Field */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">State / Region</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900"
                                            placeholder="California"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-grow flex items-center justify-center gap-2 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <Save className="h-5 w-5" />
                                                Save Profile Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ClientProfileForm;
