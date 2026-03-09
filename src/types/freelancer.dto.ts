export interface FreelancerProfileDTO {
    name?: string;
    email?: string;
    title: string;
    bio: string;
    skills: string[];
    experience?: any[]; // details can be refined later
    education?: any[]; // details can be refined later
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
}
