import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User, Award, Globe, Link as LinkIcon, Plus, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { createProfile } from '../../services/freelancerService';
import { useDispatch } from 'react-redux';
import { setActiveRole } from '../../redux/slices/auth/authSlice';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import toast from 'react-hot-toast';

const FreelancerProfileForm: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        bio: '',
        skills: [] as string[],
        hourlyRate: '',
        gitHubUrl: '',
        linkedinUrl: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.skills.length === 0) {
            toast.error('Please add at least one skill');
            return;
        }

        setLoading(true);
        try {
            const profileData = {
                ...formData,
                hourlyRate: Number(formData.hourlyRate)
            };

            const response = await createProfile(profileData);

            if (response.success) {
                dispatch(setActiveRole({ role: 'freelancer', hasProfile: true }));
                toast.success('Profile created successfully! Welcome to the freelancer community.');
                navigate('/home');
            } else {
                toast.error(response.message || 'Failed to create profile');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error creating profile');
            console.error('Profile creation error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Progress Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-full mb-4">
                            <ShieldCheck className="h-8 w-8 text-teal-600" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Set Up Your Freelancer Profile</h1>
                        <p className="mt-2 text-lg text-gray-600">This helps you get noticed by clients and start earning.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-xl border border-gray-100 rounded-2xl p-8 sm:p-10">
                        {/* Professional Title */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <Briefcase className="h-4 w-4 text-teal-600" />
                                Professional Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Senior Full Stack Developer, Logo Designer"
                                className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Bio / Description */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <User className="h-4 w-4 text-teal-600" />
                                Professional Bio
                            </label>
                            <textarea
                                name="bio"
                                required
                                rows={4}
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell clients about your expertise, experience, and what you can deliver..."
                                className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Hourly Rate & Links Row */}
                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <Award className="h-4 w-4 text-teal-600" />
                                    Hourly Rate (₹)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="hourlyRate"
                                        required
                                        value={formData.hourlyRate}
                                        onChange={handleChange}
                                        className="block w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <Globe className="h-4 w-4 text-teal-600" />
                                    GitHub URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    name="gitHubUrl"
                                    value={formData.gitHubUrl}
                                    onChange={handleChange}
                                    placeholder="https://github.com/yourusername"
                                    className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div> */}

                        {/* LinkedIn Link */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <LinkIcon className="h-4 w-4 text-teal-600" />
                                LinkedIn URL (Optional)
                            </label>
                            <input
                                type="url"
                                name="linkedinUrl"
                                value={formData.linkedinUrl}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/yourusername"
                                className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Skills Section */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <Plus className="h-4 w-4 text-teal-600" />
                                Skills
                            </label>
                            <p className="text-xs text-gray-500 italic">Press Enter to add each skill</p>
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleAddSkill}
                                placeholder="Add your skills (e.g. React, Node.js, UI/UX)"
                                className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            />

                            <div className="flex flex-wrap gap-2 mt-4">
                                {formData.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-teal-50 text-teal-700 border border-teal-100 group hover:bg-teal-100 transition-colors"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="ml-2 text-teal-400 group-hover:text-teal-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </span>
                                ))}
                                {formData.skills.length === 0 && (
                                    <span className="text-sm text-gray-400 italic">No skills added yet...</span>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-4 px-6 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Finish Setup
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FreelancerProfileForm;
