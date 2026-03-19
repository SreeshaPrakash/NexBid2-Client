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


export const getPendingVerifications = async () => {
    const response = await API.get('/admin/verification-requests');
    return response.data;
};

export const getAdminFreelancerProfile = async (id: string) => {
    const response = await API.get(`/admin/freelancer-profile/${id}`);
    return response.data;
};

export const approveVerification = async (freelancerId: string) => {
    const response = await API.post(`/admin/approve-verification/${freelancerId}`);
    return response.data;
};

export const rejectVerification = async (freelancerId: string, reason: string) => {
    const response = await API.post(`/admin/reject-verification/${freelancerId}`, { reason });
    return response.data;
};

