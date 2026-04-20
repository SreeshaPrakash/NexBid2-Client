export interface FreelancerProfileDTO {
    name?: string;
    email?: string;
    title: string;
    bio: string;
    skills: string[];
    experience?: any[];
    education?: any[];
    hourlyRate?: number;
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
}
