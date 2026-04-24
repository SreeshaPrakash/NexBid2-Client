import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { projectSchema } from '../../validations/zodSchemas';
import { ProjectVisibility } from '../../constants/projectConstants';
import type { CreateProjectDTO, ProjectDTO } from '../../types/project.dto';
import { Loader2, AlertCircle, Save, X, Paperclip } from 'lucide-react';
import { uploadToS3 } from '../../services/s3Service';
import SkillSelector from '../common/SkillSelector';

interface ProjectFormProps {
    initialData?: ProjectDTO;
    onSubmit: (data: CreateProjectDTO) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSubmit, isLoading, error }) => {
    const navigate = useNavigate();
    const defaultBiddingDeadline = new Date();
    defaultBiddingDeadline.setDate(defaultBiddingDeadline.getDate() + 5);
    
    const year = defaultBiddingDeadline.getFullYear();
    const month = String(defaultBiddingDeadline.getMonth() + 1).padStart(2, '0');
    const day = String(defaultBiddingDeadline.getDate()).padStart(2, '0');
    const defaultBiddingDeadlineString = `${year}-${month}-${day}`;

    const [uploadingFiles, setUploadingFiles] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<CreateProjectDTO>({
        resolver: zodResolver(projectSchema),
        defaultValues: initialData ? {
            title: initialData.title,
            description: initialData.description,
            budget: initialData.budget,
            biddingDeadline: initialData.biddingDeadline ? new Date(initialData.biddingDeadline).toISOString().split('T')[0] : '',
            deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : null,
            visibility: initialData.visibility,
            attachments: initialData.attachments || [],
            skillsRequired: initialData.skillsRequired || [],
        } : {
            biddingDeadline: defaultBiddingDeadlineString,
            visibility: ProjectVisibility.PUBLIC,
            attachments: [],
            skillsRequired: [],
        }
    });

    const skills = watch('skillsRequired') || [];
    const attachments = watch('attachments') || [];

    const handleSkillsChange = (newSkills: string[]) => {
        setValue('skillsRequired', newSkills, { shouldValidate: true });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploadingFiles(true);
        const newAttachments = [...attachments];
        try {
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                const key = await uploadToS3(file);
                newAttachments.push(key);
            }
            setValue('attachments', newAttachments, { shouldValidate: true });
        } catch (err) {
            console.error("Failed to upload attachments.", err);
        } finally {
            setUploadingFiles(false);
            e.target.value = '';
        }
    };

    const removeAttachment = (indexToRemove: number) => {
        setValue('attachments', attachments.filter((_, i) => i !== indexToRemove), { shouldValidate: true });
    };

    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title,
                description: initialData.description,
                budget: initialData.budget,
                biddingDeadline: initialData.biddingDeadline ? new Date(initialData.biddingDeadline).toISOString().split('T')[0] : '',
                deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : null,
                visibility: initialData.visibility,
                attachments: initialData.attachments || [],
                skillsRequired: initialData.skillsRequired || [],
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Project Title</label>
                    <input
                        {...register('title')}
                        type="text"
                        placeholder="e.g. Build a Modern Landing Page"
                        className={`w-full bg-white/5 border ${errors.title ? 'border-rose-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                    />
                    {errors.title && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.title.message}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Detailed Description</label>
                    <textarea
                        {...register('description')}
                        rows={6}
                        placeholder="Explain what needs to be done..."
                        className={`w-full bg-white/5 border ${errors.description ? 'border-rose-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none`}
                    />
                    {errors.description && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.description.message}</p>}
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Estimate Budget (₹)</label>
                    <input
                        {...register('budget', { valueAsNumber: true })}
                        type="number"
                        placeholder="e.g. 500"
                        className={`w-full bg-white/5 border ${errors.budget ? 'border-rose-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                    />
                    {errors.budget && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.budget.message}</p>}
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Required Skills</label>
                    <SkillSelector 
                        selectedSkills={skills} 
                        onSkillsChange={handleSkillsChange}
                        error={errors.skillsRequired?.message}
                        placeholder="Search and select required skills..."
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Attachments (Optional)</label>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 ${uploadingFiles ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400'} font-bold rounded-xl transition-all border border-indigo-500/20`}>
                                {uploadingFiles ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                                {uploadingFiles ? 'Uploading...' : 'Add Files'}
                                <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={uploadingFiles} />
                            </label>
                            <span className="text-xs text-slate-500">Upload multiple files (PDF, images, etc.)</span>
                        </div>

                        {attachments.length > 0 && (
                            <div className="flex flex-col gap-2">
                                {attachments.map((file: string, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
                                        <div className="flex items-center gap-3 truncate">
                                            <Paperclip className="h-4 w-4 text-emerald-500 shrink-0" />
                                            <span className="text-sm text-slate-300 truncate">{file.split('/').pop()}</span>
                                        </div>
                                        <button type="button" onClick={() => removeAttachment(index)} className="text-slate-500 hover:text-rose-500 transition-colors shrink-0">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <input type="hidden" {...register('biddingDeadline')} />
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-white/5">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 text-slate-400 font-bold hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            {initialData ? 'Update Project' : 'Post Project'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ProjectForm;
