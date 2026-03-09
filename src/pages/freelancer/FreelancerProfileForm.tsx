import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User, Globe, Link as LinkIcon, Plus, X, ArrowRight, ShieldCheck, ArrowLeft, Camera, Phone, Mail } from 'lucide-react';
import { createProfile, getProfile, updateProfile } from '../../services/freelancerService';
import { useDispatch } from 'react-redux';
import { setActiveRole, updateUser } from '../../redux/slices/auth/authSlice';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import toast from 'react-hot-toast';
import type { FreelancerProfileDTO } from '../../types/freelancer.dto';

const FreelancerProfileForm: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [skillInput, setSkillInput] = useState('');
    const [portfolioInput, setPortfolioInput] = useState('');
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
        const fetchExistingProfile = async () => {
            try {
                const response = await getProfile();
                if (response.success && response.data) {
                    setFormData({
                        name: response.data.name || '',
                        email: response.data.email || '',
                        title: response.data.title || '',
                        bio: response.data.bio || '',
                        skills: response.data.skills || [],
                        hourlyRate: response.data.hourlyRate || 0,
                        experienceInYears: response.data.experienceInYears || 0,
                        phone: response.data.phone || '',
                        country: response.data.country || '',
                        state: response.data.state || '',
                        gitHubUrl: response.data.gitHubUrl || '',
                        linkedinUrl: response.data.linkedinUrl || '',
                        portfolio: response.data.portfolio || '',
                        previousWorks: response.data.previousWorks || []
                    });
                    setIsEditMode(true);
                }
            } catch (error) {
                console.log('No existing profile found or error fetching');
            } finally {
                setFetching(false);
            }
        };

        fetchExistingProfile();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.skills.length === 0) {
            toast.error('Please specify at least one core skill');
            return;
        }

        setLoading(true);
        try {
            const response = isEditMode
                ? await updateProfile(formData)
                : await createProfile(formData);

            if (response.success) {
                if (!isEditMode) {
                    dispatch(setActiveRole({ role: 'freelancer', hasProfile: true }));
                }
                if (formData.name) {
                    dispatch(updateUser({ name: formData.name }));
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
                    {/* Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-bold text-xs uppercase tracking-widest mb-4 group"
                            >
                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                Cancel
                            </button>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                {isEditMode ? 'Edit Professional Profile' : 'Setup Your Profile'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <span className="text-slate-600 font-bold text-xs tracking-tight">Secure Update</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Avatar Section */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
                                <div className="relative inline-block mx-auto mb-6">
                                    <div className="h-40 w-40 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center overflow-hidden">
                                        <User className="h-20 w-20 text-slate-200" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <Camera className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Professional Avatar</h3>
                                <p className="text-slate-400 text-xs font-medium">Add a photo to build trust</p>
                            </div>
                        </div>

                        {/* Main Interaction Fields */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
                                {/* Identity */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            readOnly
                                            value={formData.email}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none opacity-70 cursor-not-allowed font-semibold text-slate-900 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            placeholder="e.g. India"
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            State / City
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="e.g. Kerala"
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Briefcase className="h-4 w-4" />
                                        Professional Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Full Stack Web Developer"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900"
                                    />
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Professional Summary
                                    </label>
                                    <textarea
                                        name="bio"
                                        required
                                        rows={5}
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Describe your experience and focus area..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900 resize-none"
                                    />
                                </div>

                                {/* Rate and Experience */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Briefcase className="h-4 w-4" />
                                            Exp. (Years)
                                        </label>
                                        <input
                                            type="number"
                                            name="experienceInYears"
                                            value={formData.experienceInYears}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Briefcase className="h-4 w-4" />
                                            Hourly Rate (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="hourlyRate"
                                            required
                                            value={formData.hourlyRate}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* External Links */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 border-b-2 border-slate-900 w-fit">Professional Presence</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <LinkIcon className="h-4 w-4" />
                                                Portfolio Link
                                            </label>
                                            <input
                                                type="url"
                                                name="portfolio"
                                                value={formData.portfolio}
                                                onChange={handleChange}
                                                placeholder="https://yourportfolio.com"
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <Globe className="h-4 w-4" />
                                                GitHub
                                            </label>
                                            <input
                                                type="url"
                                                name="gitHubUrl"
                                                value={formData.gitHubUrl}
                                                onChange={handleChange}
                                                placeholder="https://github.com/..."
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <LinkIcon className="h-4 w-4" />
                                                LinkedIn
                                            </label>
                                            <input
                                                type="url"
                                                name="linkedinUrl"
                                                value={formData.linkedinUrl}
                                                onChange={handleChange}
                                                placeholder="https://linkedin.com/in/..."
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+91 ..."
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Skill Matrix (Press Enter to add)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={handleAddSkill}
                                            placeholder="Add technical or creative skills"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900"
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 group transition-all"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(skill)}
                                                    className="ml-2 text-slate-400 hover:text-red-500"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Portfolio Media */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Portfolio Media URLs (Press Enter to add)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            value={portfolioInput}
                                            onChange={(e) => setPortfolioInput(e.target.value)}
                                            onKeyDown={handleAddPortfolio}
                                            placeholder="Add image or video URLs of your past work"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-slate-900"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {formData.previousWorks?.map((item: string, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 group"
                                            >
                                                <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">
                                                    {item}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removePortfolioItem(item)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Form Submit Section */}
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
                                                {isEditMode ? 'Update Profile' : 'Setup Profile'}
                                                <ArrowRight className="h-5 w-5" />
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

export default FreelancerProfileForm;
