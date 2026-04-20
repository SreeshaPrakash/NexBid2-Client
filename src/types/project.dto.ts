import { ProjectStatus, ProjectVisibility } from "../constants/projectConstants";

export interface ProjectDTO {
    _id?: string;
    id?: string;
    clientId: string;
    title: string;
    description: string;
    budget: number;
    deadline?: string | null;
    biddingDeadline: string;
    attachments: string[];
    skillsRequired: string[];
    projectStatus: ProjectStatus;
    visibility: ProjectVisibility;
    selectedFreelancer?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateProjectDTO {
    title: string;
    description: string;
    budget: number;
    deadline?: string | null;
    biddingDeadline: string;
    attachments?: string[];
    skillsRequired: string[];
    visibility?: ProjectVisibility;
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
    projectStatus?: ProjectStatus;
}
