export interface FreelancerProfileDTO {
    title: string;
    bio: string;
    skills: string[];
    experience?: any[]; // details can be refined later
    education?: any[]; // details can be refined later
    hourlyRate?: number;
    contactNumber?: string;
    portfolio?: string[];
}
