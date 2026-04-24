export interface FreelancerProfileDTO {
    name?: string;
    email?: string;
    title: string;
    bio: string;
    skills: string[];
    experiences?: { title: string; description: string }[];
    education?: string[];
    contactNumber?: string;
    phone?: string | number;
    country?: string;
    state?: string;
    gitHubUrl?: string;
    linkedinUrl?: string;
    portfolio?: string;
    previousWorks?: string[];
    experienceInYears?: number;
    portfolioImage?: string;
    profileImage?: string;
    verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
    rejectionReason?: string;
    completedProjects?: number;
    createdAt?: string;
}
