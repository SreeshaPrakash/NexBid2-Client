import API from '../api/axiosinterceptor';
import type { LoginDTO, AuthResponse } from '../types/auth.dto';
import type { GetUserQueryDTO } from '../types/admin.dto';
import { ApiRoute } from '../constants/apiConstants';

export const adminLogin = async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await API.post(ApiRoute.ADMIN_LOGIN, data);
    return response.data;
};

export const getAllUsers = async (query: GetUserQueryDTO) => {
    const response = await API.get(ApiRoute.ADMIN_GET_ALL_USERS, { params: query });
    return response.data;
};

export const getUserById = async (userId: string) => {
    const response = await API.get(`${ApiRoute.ADMIN_GET_USER_BY_ID}/${userId}`);
    return response.data;
};

export const toggleBlockStatus = async (userId: string, isBlocked: boolean) => {
    const response = await API.patch(`${ApiRoute.ADMIN_BLOCK_STATUS}/${userId}`, { isBlocked });
    return response.data;
};


export const getPendingVerifications = async () => {
    const response = await API.get(ApiRoute.ADMIN_VERIFICATION_REQUESTS);
    return response.data;
};

export const getAdminFreelancerProfile = async (id: string) => {
    const response = await API.get(`${ApiRoute.ADMIN_FREELANCER_PROFILE}/${id}`);
    return response.data;
};

export const approveVerification = async (freelancerId: string) => {
    const response = await API.post(`${ApiRoute.ADMIN_APPROVE_VERIFICATION}/${freelancerId}`);
    return response.data;
};

export const rejectVerification = async (freelancerId: string, reason: string) => {
    const response = await API.post(`${ApiRoute.ADMIN_REJECT_VERIFICATION}/${freelancerId}`, { reason });
    return response.data;
};

export const logoutAdmin = async () => {
    const response = await API.post(ApiRoute.ADMIN_LOGOUT);
    return response.data;
};
