import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as projectService from '../../../services/projectService';
import type { ProjectDTO, CreateProjectDTO, UpdateProjectDTO } from '../../../types/project.dto';

interface ProjectState {
    projects: ProjectDTO[];
    totalProjects: number;
    currentProject: ProjectDTO | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProjectState = {
    projects: [],
    totalProjects: 0,
    currentProject: null,
    loading: false,
    error: null,
};

export const fetchClientProjects = createAsyncThunk(
    'project/fetchClientProjects',
    async ({ page, limit }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
        try {
            return await projectService.getClientProjects(page, limit);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch projects');
        }
    }
);

export const fetchOpenProjects = createAsyncThunk(
    'project/fetchOpenProjects',
    async ({ page, limit }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
        try {
            return await projectService.getOpenProjects(page, limit);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch open projects');
        }
    }
);

export const fetchProjectById = createAsyncThunk(
    'project/fetchProjectById',
    async (projectId: string, { rejectWithValue }) => {
        try {
            return await projectService.fetchProjectById(projectId);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch project details');
        }
    }
);

export const createProject = createAsyncThunk(
    'project/createProject',
    async (data: CreateProjectDTO, { rejectWithValue }) => {
        try {
            return await projectService.createProject(data);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to create project');
        }
    }
);

export const updateProject = createAsyncThunk(
    'project/updateProject',
    async ({ projectId, data }: { projectId: string; data: UpdateProjectDTO }, { rejectWithValue }) => {
        try {
            return await projectService.updateProject(projectId, data);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to update project');
        }
    }
);

export const deleteProject = createAsyncThunk(
    'project/deleteProject',
    async (projectId: string, { rejectWithValue }) => {
        try {
            await projectService.deleteProject(projectId);
            return projectId;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to delete project');
        }
    }
);

export const extendProject = createAsyncThunk(
    'project/extendProject',
    async (projectId: string, { rejectWithValue }) => {
        try {
            return await projectService.extendProject(projectId);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to extend project');
        }
    }
);

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        clearCurrentProject: (state) => {
            state.currentProject = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Client Projects
            .addCase(fetchClientProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClientProjects.fulfilled, (state, action: PayloadAction<{ projects: ProjectDTO[], total: number }>) => {
                state.loading = false;
                state.projects = action.payload.projects;
                state.totalProjects = action.payload.total;
            })
            .addCase(fetchClientProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Open Projects
            .addCase(fetchOpenProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOpenProjects.fulfilled, (state, action: PayloadAction<{ projects: ProjectDTO[], total: number }>) => {
                state.loading = false;
                state.projects = action.payload.projects;
                state.totalProjects = action.payload.total;
            })
            .addCase(fetchOpenProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Project By Id
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<ProjectDTO>) => {
                state.loading = false;
                state.currentProject = action.payload;
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Project
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProject.fulfilled, (state, action: PayloadAction<ProjectDTO>) => {
                state.loading = false;
                state.projects.unshift(action.payload);
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Project
            .addCase(updateProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProject.fulfilled, (state, action: PayloadAction<ProjectDTO>) => {
                state.loading = false;
                const index = state.projects.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
                if (state.currentProject?.id === action.payload.id) {
                    state.currentProject = action.payload;
                }
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete Project
            .addCase(deleteProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.projects = state.projects.filter(p => p.id !== action.payload);
                if (state.currentProject?.id === action.payload) {
                    state.currentProject = null;
                }
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Extend Project
            .addCase(extendProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(extendProject.fulfilled, (state, action: PayloadAction<ProjectDTO>) => {
                state.loading = false;
                const index = state.projects.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
            })
            .addCase(extendProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;
