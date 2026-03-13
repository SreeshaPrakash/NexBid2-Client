import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, ArrowLeft, Camera, ShieldCheck } from 'lucide-react';
import { getClientProfile, updateClientProfile } from '../../services/clientService';
import { getProfile, updateProfile } from '../../services/freelancerService';
import { uploadToS3 } from '../../services/s3Service';
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
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState<ClientProfileDTO>({
        name: '',
        email: '',
        phone: '',
        country: '',
        state: '',
        profileImage: ''
    });

    useEffect(() => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [selectedFile]);

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
            let updatedProfileImage = formData.profileImage;

            if (selectedFile) {
                setUploading(true);
                try {
                    updatedProfileImage = await uploadToS3(selectedFile);
                } catch (error) {
                    console.error('Error uploading image:', error);
                    toast.error('Failed to upload profile image to S3');
                    setLoading(false);
                    setUploading(false);
                    return;
                } finally {
                    setUploading(false);
                }
            }

            const finalData = { ...formData, profileImage: updatedProfileImage };

            // Update client profile
            const response = await updateClientProfile(finalData);
            if (response.success) {
                // Update local state to reflect the new image
                setFormData(finalData);
                setSelectedFile(null);

                // Bi-directional Sync: If the user has a freelancer profile, update it too
                try {
                    const freelancerResp = await getProfile();
                    if (freelancerResp.success && freelancerResp.data) {
                        await updateProfile({
                            ...freelancerResp.data,
                            name: finalData.name,
                            phone: finalData.phone,
                            country: finalData.country,
                            state: finalData.state,
                            email: finalData.email,
                            profileImage: finalData.profileImage
                        });
                    }
                } catch (syncError) {
                    console.error('Error syncing to freelancer profile:', syncError);
                }

                // Only update Redux if name actually changed to minimize re-renders
                if (finalData.name !== response.data.name) {
                    dispatch(updateUser({ name: finalData.name }));
                }
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
            <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-700 border-t-transparent"></div>
            </div>
        );
    }

    const inputClasses = "w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-white text-sm placeholder:text-slate-600";
    const labelClasses = "text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block";

    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900">
            <Navbar />
            <main className="flex-grow pt-[80px] pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <button
                                onClick={() => navigate('/client/profile')}
                                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-[10px] uppercase tracking-widest mb-4 group"
                            >
                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                Cancel
                            </button>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">Edit Client Profile</h1>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Secure Update</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Avatar Section */}
                        <div className="md:col-span-4 space-y-6">
                            <div className="bg-[#111118] p-8 rounded-[2rem] border border-white/5 shadow-sm text-center">
                                <div className="relative inline-block mx-auto mb-6">
                                    {/* <div className="h-40 w-40 rounded-[2rem] bg-white/5 border border-white/5 shadow-inner flex items-center justify-center overflow-hidden">
                                        {formData.profileImage ? (
                                            <img src={formData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-20 w-20 text-slate-700" />
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <Camera className="h-8 w-8 text-white" />
                                        </div>
                                    </div> */}

                                    <div className="h-40 w-40 rounded-[2rem] bg-white/5 border border-white/5 shadow-inner flex items-center justify-center overflow-hidden">
                                        {previewUrl || formData.profileImage ? (
                                            <img src={previewUrl || formData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-20 w-20 text-slate-700" />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <Camera className="h-8 w-8 text-white" />
                                        </div>
                                    </div>







                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{formData.name}</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">{formData.email}</p>
                            </div>
                        </div>

                        {/* Main Fields */}
                        <div className="md:col-span-8 space-y-6">
                            <div className="bg-[#111118] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-sm space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <div className="space-y-1">
                                        <label className={labelClasses}>Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={inputClasses}
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    {/* Email Field - Disabled */}
                                    <div className="space-y-1 opacity-50">
                                        <label className={labelClasses}>Email Address</label>
                                        <input
                                            type="email"
                                            disabled
                                            value={formData.email}
                                            className={inputClasses + " cursor-not-allowed"}
                                        />
                                    </div>

                                    {/* Phone Field */}
                                    <div className="space-y-1">
                                        <label className={labelClasses}>Contact Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={inputClasses}
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>

                                    <div className="hidden sm:block"></div>

                                    {/* Country Field */}
                                    <div className="space-y-1">
                                        <label className={labelClasses}>Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className={inputClasses}
                                            placeholder="United States"
                                        />
                                    </div>

                                    {/* State Field */}
                                    <div className="space-y-1">
                                        <label className={labelClasses}>State / Region</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className={inputClasses}
                                            placeholder="California"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading || uploading}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-500 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-indigo-900/20"
                                    >
                                        {loading || uploading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>{uploading ? 'Uploading Image...' : 'Saving Changes...'}</span>
                                            </div>
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

























