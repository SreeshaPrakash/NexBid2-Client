import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User, Globe, Link as LinkIcon, Plus, X, ArrowRight, ShieldCheck, ArrowLeft, Camera, Phone, Mail, Eye } from 'lucide-react';
import { createProfile, getProfile, updateProfile } from '../../services/freelancerService';
import { uploadToS3 } from '../../services/s3Service';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRole, updateUser } from '../../redux/slices/auth/authSlice';
import { getClientProfile, updateClientProfile } from '../../services/clientService';
import type { RootState } from '../../redux/store';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import toast from 'react-hot-toast';
import type { FreelancerProfileDTO } from '../../types/freelancer.dto';

const FreelancerProfileForm: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [skillInput, setSkillInput] = useState('');
    const [portfolioInput, setPortfolioInput] = useState('');
    const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [viewingImage, setViewingImage] = useState<string | null>(null);

    const isVideo = (url: string) => {
        return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
    };
    const [formData, setFormData] = useState<FreelancerProfileDTO>({
        name: '',
        email: '',
        title: '',
        bio: '',
        skills: [],
        hourlyRate: 0,
        experienceInYears: 0,
        phone: '',
        country: '',
        state: '',
        gitHubUrl: '',
        linkedinUrl: '',
        portfolio: '',
        previousWorks: []
    });

    useEffect(() => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [selectedFile]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Fetch independently to prevent one failure from blocking the other
                let clientData = null;
                let freelancerData = null;

                try {
                    const clientResp = await getClientProfile();
                    if (clientResp.success) clientData = clientResp.data;
                } catch (e) {
                    console.error('Client profile fetch failed', e);
                }

                try {
                    const freelancerResp = await getProfile();
                    if (freelancerResp.success) freelancerData = freelancerResp.data;
                } catch (e) {
                    // This is expected if the freelancer profile doesn't exist yet
                    console.log('Freelancer profile not found or fetch failed');
                }

                if (freelancerData) {
                    setIsEditMode(true);
                    setFormData(prev => ({
                        ...prev,
                        ...freelancerData,
                        // Priority: Freelancer Data -> Client Data -> User State -> Empty
                        name: freelancerData.name || clientData?.name || user?.name || '',
                        email: freelancerData.email || clientData?.email || user?.email || '',
                        phone: freelancerData.phone || clientData?.phone || '',
                        country: freelancerData.country || clientData?.country || '',
                        state: freelancerData.state || clientData?.state || '',
                        profileImage: freelancerData.profileImage || clientData?.profileImage || ''
                    }));
                } else {
                    // Creating new profile: Use client/user data
                    setFormData(prev => ({
                        ...prev,
                        name: clientData?.name || user?.name || '',
                        email: clientData?.email || user?.email || '',
                        phone: clientData?.phone || '',
                        country: clientData?.country || '',
                        state: clientData?.state || '',
                        profileImage: clientData?.profileImage || ''
                    }));
                }
            } catch (error) {
                console.error('Critical error loading profile data:', error);
                toast.error('Error initializing form');
            } finally {
                setFetching(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: (name === 'hourlyRate' || name === 'experienceInYears') ? Number(value) : value
        });
    };

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!formData.skills.includes(skillInput.trim())) {
                setFormData({
                    ...formData,
                    skills: [...formData.skills, skillInput.trim()]
                });
            }
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleAddPortfolio = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && portfolioInput.trim()) {
            e.preventDefault();
            if (!formData.previousWorks?.includes(portfolioInput.trim())) {
                setFormData({
                    ...formData,
                    previousWorks: [...(formData.previousWorks || []), portfolioInput.trim()]
                });
            }
            setPortfolioInput('');
        }
    };

    const removePortfolioItem = (itemToRemove: string) => {
        setFormData({
            ...formData,
            previousWorks: formData.previousWorks?.filter(item => item !== itemToRemove)
        });
    };

    const handlePortfolioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingPortfolio(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const key = await uploadToS3(file);
                return key;
            });

            const uploadedKeys = await Promise.all(uploadPromises);
            
            setFormData(prev => {
                const currentWorks = prev.previousWorks || [];
                const newWorks = [...currentWorks];
                
                uploadedKeys.forEach(key => {
                    if (!newWorks.includes(key)) {
                        newWorks.push(key);
                    }
                });

                return {
                    ...prev,
                    previousWorks: newWorks
                };
            });

            toast.success(`${uploadedKeys.length} portfolio file(s) uploaded & added`);
        } catch (error) {
            console.error('Portfolio upload failed', error);
            toast.error('Failed to upload some portfolio files');
        } finally {
            setUploadingPortfolio(false);
            // Reset input value to allow selecting same files again
            e.target.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.skills.length === 0) {
            toast.error('Please specify at least one core skill');
            return;
        }

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

            // Update freelancer profile
            const response = isEditMode
                ? await updateProfile(finalData)
                : await createProfile(finalData);

            if (response.success) {
                // Update local state and clear selected file
                setFormData(finalData);
                setSelectedFile(null);

                // Bi-directional Sync: Also update the shared fields in the client profile
                await updateClientProfile({
                    name: finalData.name || '',
                    phone: String(finalData.phone || ''),
                    country: finalData.country || '',
                    state: finalData.state || '',
                    email: finalData.email || '',
                    profileImage: finalData.profileImage
                });

                if (!isEditMode) {
                    dispatch(setActiveRole({ role: 'freelancer', hasProfile: true }));
                }
                if (finalData.name) {
                    dispatch(updateUser({ name: finalData.name }));
                }
                toast.success(isEditMode ? 'Profile updated successfully' : 'Profile established!');
                navigate('/freelancer/profile');
            } else {
                toast.error(response.message || `Operation failed`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Network error during profile ${isEditMode ? 'update' : 'setup'}`);
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

    const inputClasses = "w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-white text-sm placeholder:text-slate-600";
    const labelClasses = "text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2 mb-2";

    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900">
            <Navbar />
            <main className="flex-grow pt-[80px] pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <button
                                onClick={() => navigate('/freelancer/profile')}
                                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-[10px] uppercase tracking-widest mb-4 group"
                            >
                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                Cancel
                            </button>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">
                                {isEditMode ? 'Edit Professional Profile' : 'Setup Your Profile'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Secure Update</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Avatar Section */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-[#111118] p-8 rounded-[2rem] border border-white/5 shadow-sm text-center">
                                <div className="relative inline-block mx-auto mb-6">
                                    <div className="h-40 w-40 rounded-[2rem] bg-white/5 border border-white/5 shadow-inner flex items-center justify-center overflow-hidden group">
                                        {previewUrl || formData.profileImage ? (
                                            <img src={previewUrl || formData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-20 w-20 text-slate-700" />
                                        )}
                                        
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                            {(previewUrl || formData.profileImage) && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewingImage(previewUrl || formData.profileImage || null); }}
                                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                                                    title="View Photo"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                            )}
                                            <label className="cursor-pointer p-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-colors shadow-lg" title="Change Photo">
                                                <Camera className="h-5 w-5" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">Professional Avatar</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Build Trust with a Photo</p>
                            </div>
                        </div>

                        {/* Main Interaction Fields */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-[#111118] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-sm space-y-8">
                                {/* Identity */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className={labelClasses}>
                                            <User className="h-3.5 w-3.5" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={inputClasses}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelClasses}>
                                            <Mail className="h-3.5 w-3.5" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            readOnly
                                            value={formData.email}
                                            className={inputClasses + " opacity-50 cursor-not-allowed"}
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className={labelClasses}>
                                            <Globe className="h-3.5 w-3.5" />
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            placeholder="e.g. India"
                                            className={inputClasses}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelClasses}>
                                            <Globe className="h-3.5 w-3.5" />
                                            State / City
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="e.g. Kerala"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="space-y-1">
                                    <label className={labelClasses}>
                                        <Briefcase className="h-3.5 w-3.5" />
                                        Professional Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Full Stack Web Developer"
                                        className={inputClasses}
                                    />
                                </div>

                                {/* Bio */}
                                <div className="space-y-1">
                                    <label className={labelClasses}>
                                        <User className="h-3.5 w-3.5" />
                                        Professional Summary
                                    </label>
                                    <textarea
                                        name="bio"
                                        required
                                        rows={5}
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Describe your experience and focus area..."
                                        className={inputClasses + " resize-none"}
                                    />
                                </div>

                                {/* Rate and Experience */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className={labelClasses}>
                                            <Briefcase className="h-3.5 w-3.5" />
                                            Exp. (Years)
                                        </label>
                                        <input
                                            type="number"
                                            name="experienceInYears"
                                            value={formData.experienceInYears}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className={inputClasses}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelClasses}>
                                            <Briefcase className="h-3.5 w-3.5" />
                                            Hourly Rate (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="hourlyRate"
                                            required
                                            value={formData.hourlyRate}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>

                                {/* External Links */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-4 pb-1 border-b border-indigo-500/30 w-fit">Professional Presence</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className={labelClasses}>
                                                <LinkIcon className="h-3.5 w-3.5" />
                                                Portfolio Link
                                            </label>
                                            <input
                                                type="url"
                                                name="portfolio"
                                                value={formData.portfolio}
                                                onChange={handleChange}
                                                placeholder="https://yourportfolio.com"
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className={labelClasses}>
                                                <Globe className="h-3.5 w-3.5" />
                                                GitHub
                                            </label>
                                            <input
                                                type="url"
                                                name="gitHubUrl"
                                                value={formData.gitHubUrl}
                                                onChange={handleChange}
                                                placeholder="https://github.com/..."
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className={labelClasses}>
                                                <LinkIcon className="h-3.5 w-3.5" />
                                                LinkedIn
                                            </label>
                                            <input
                                                type="url"
                                                name="linkedinUrl"
                                                value={formData.linkedinUrl}
                                                onChange={handleChange}
                                                placeholder="https://linkedin.com/in/..."
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className={labelClasses}>
                                                <Phone className="h-3.5 w-3.5" />
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+91 ..."
                                                className={inputClasses}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="space-y-4">
                                    <label className={labelClasses}>
                                        <Plus className="h-3.5 w-3.5" />
                                        Skill Matrix (Press Enter)
                                    </label>
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleAddSkill}
                                        placeholder="Add technical or creative skills"
                                        className={inputClasses}
                                    />

                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-black bg-white/5 text-slate-300 border border-white/5 transition-all"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(skill)}
                                                    className="ml-2 text-slate-500 hover:text-red-400"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Portfolio Media */}
                                <div className="space-y-4">
                                    <label className={labelClasses}>
                                        <Plus className="h-3.5 w-3.5" />
                                        Portfolio Media URLs (Press Enter)
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-grow">
                                            <input
                                                type="url"
                                                value={portfolioInput}
                                                onChange={(e) => setPortfolioInput(e.target.value)}
                                                onKeyDown={handleAddPortfolio}
                                                placeholder="Add image or video URLs (Press Enter)"
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                multiple={true}
                                                accept="image/*,video/*"
                                                onChange={handlePortfolioFileUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                                disabled={uploadingPortfolio}
                                            />
                                            <div className={`h-full px-6 py-3.5 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center gap-2 text-slate-300 font-bold text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all ${uploadingPortfolio ? 'opacity-50' : ''}`}>
                                                {uploadingPortfolio ? (
                                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                ) : <Plus className="h-3.5 w-3.5" />}
                                                {uploadingPortfolio ? 'Uploading...' : 'Upload File'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {formData.previousWorks?.map((item: string, index: number) => (
                                            <div
                                                key={index}
                                                className="group relative aspect-video bg-[#181820] rounded-xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer"
                                                onClick={() => setViewingImage(item)}
                                            >
                                                {isVideo(item) ? (
                                                    <video src={item} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" muted />
                                                ) : (
                                                    <img src={item} alt={`Portfolio ${index + 1}`} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                )}
                                                
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); removePortfolioItem(item); }}
                                                        className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Form Submit Section */}
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
                                                {isEditMode ? 'Update Profile' : 'Establish Profile'}
                                                <ArrowRight className="h-4 w-4" />
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

export default FreelancerProfileForm;
