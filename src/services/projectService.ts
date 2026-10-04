import API from '../api/axiosinterceptor';
import type { ProjectDTO, CreateProjectDTO, UpdateProjectDTO } from '../types/project.dto';
import { ApiRoute } from '../constants/apiConstants';

export const createProject = async (data: CreateProjectDTO): Promise<ProjectDTO> => {
    const response = await API.post(ApiRoute.PROJECT_CREATE, data);
    return response.data.project;
};

export const getClientProjects = async (): Promise<ProjectDTO[]> => {
    const response = await API.get(ApiRoute.PROJECT_LIST);
    return response.data.projects;
};

export const getOpenProjects = async (searchQuery?: string): Promise<ProjectDTO[]> => {
    const url = searchQuery ? `${ApiRoute.PROJECT_OPEN}?search=${encodeURIComponent(searchQuery)}` : ApiRoute.PROJECT_OPEN;
    const response = await API.get(url);
    return response.data.projects;
};

export const fetchProjectById = async (projectId: string): Promise<ProjectDTO> => {
    const response = await API.get(`${ApiRoute.PROJECT_BASE}/${projectId}`);
    return response.data.project;
};

export const updateProject = async (projectId: string, data: UpdateProjectDTO): Promise<ProjectDTO> => {
    const response = await API.patch(`${ApiRoute.PROJECT_UPDATE}/${projectId}`, data);
    return response.data.project;
};

export const deleteProject = async (projectId: string): Promise<void> => {
    await API.delete(`${ApiRoute.PROJECT_BASE}/${projectId}`);
};

export const searchSkills = async (query: string): Promise<string[]> => {
    if (!query.trim()) return [];
    try {
        const response = await API.get(`${ApiRoute.SKILLS}?q=${query}`);
        // Assuming response.data.data is an array of { id, name } objects
        return response.data.data.map((skill: any) => skill.name);
    } catch {
        return [];
    }
};
