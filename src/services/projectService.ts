import API from '../api/axiosinterceptor';
import type { ProjectDTO, CreateProjectDTO, UpdateProjectDTO } from '../types/project.dto';

export const createProject = async (data: CreateProjectDTO): Promise<ProjectDTO> => {
    const response = await API.post('/project/create', data);
    return response.data.project;
};

export const getClientProjects = async (): Promise<ProjectDTO[]> => {
    const response = await API.get('/project/list');
    return response.data.projects;
};

export const getOpenProjects = async (): Promise<ProjectDTO[]> => {
    const response = await API.get('/project/openProjects');
    return response.data.projects;
};

export const fetchProjectById = async (projectId: string): Promise<ProjectDTO> => {
    const response = await API.get(`/project/${projectId}`);
    return response.data.project;
};

export const updateProject = async (projectId: string, data: UpdateProjectDTO): Promise<ProjectDTO> => {
    const response = await API.patch(`/project/update/${projectId}`, data);
    return response.data.project;
};

export const deleteProject = async (projectId: string): Promise<void> => {
    await API.delete(`/project/${projectId}`);
};

export const searchSkills = async (query: string): Promise<string[]> => {
    if (!query.trim()) return [];
    try {
        const response = await API.get(`/skills?q=${query}`);
        // Assuming response.data.data is an array of { id, name } objects
        return response.data.data.map((skill: any) => skill.name);
    } catch {
        return [];
    }
};
