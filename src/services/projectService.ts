import API from '../api/axiosinterceptor';
import type { ProjectDTO, CreateProjectDTO, UpdateProjectDTO } from '../types/project.dto';

export const createProject = async (data: CreateProjectDTO): Promise<ProjectDTO> => {
    const response = await API.post('/project/create', data);
    return response.data.project;
};

export const getClientProjects = async (page?: number, limit?: number): Promise<{ projects: ProjectDTO[], total: number }> => {
    const response = await API.get(`/project/list?page=${page || 1}&limit=${limit || 4}`);
    return { projects: response.data.projects, total: response.data.total };
};

export const getOpenProjects = async (page?: number, limit?: number): Promise<{ projects: ProjectDTO[], total: number }> => {
    const response = await API.get(`/project/openProjects?page=${page || 1}&limit=${limit || 4}`);
    return { projects: response.data.projects, total: response.data.total };
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

export const extendProject = async (projectId: string): Promise<ProjectDTO> => {
    const response = await API.patch(`/project/extend/${projectId}`);
    return response.data.project;
};

export const searchSkills = async (query: string): Promise<string[]> => {
    if (!query.trim()) return [];
    try {
        const response = await API.get(`/skills?q=${query}`);
        // Assuming response.data.data is an array of { id, name } objects
        return response.data.data.map((skill: { name: string }) => skill.name);
    } catch {
        return [];
    }
};
