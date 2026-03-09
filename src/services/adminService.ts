import API from '../api/axiosinterceptor';
import type { LoginDTO, AuthResponse } from '../types/auth.dto';
import type { GetUserQueryDTO } from '../types/admin.dto';

export const adminLogin = async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await API.post('/admin/login', data);
    return response.data;
};

export const getAllUsers = async (query: GetUserQueryDTO) => {
    const response = await API.get('/admin/getAllUsers', { params: query });
    return response.data;
};

export const getUserById = async (userId: string) => {
    const response = await API.get(`/admin/getUserById/${userId}`);
    return response.data;
};

export const toggleBlockStatus = async (userId: string, isBlocked: boolean) => {
    const response = await API.patch(`/admin/block-status/${userId}`, { isBlocked });
    return response.data;
};

