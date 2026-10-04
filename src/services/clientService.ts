import API from '../api/axiosinterceptor';
import type { ClientProfileDTO } from '../types/client.dto';
import { ApiRoute } from '../constants/apiConstants';

export const getClientProfile = async () => {
    const response = await API.get(ApiRoute.CLIENT_PROFILE);
    return response.data;
};

export const updateClientProfile = async (data: Partial<ClientProfileDTO>) => {
    const response = await API.patch(ApiRoute.CLIENT_PROFILE, data);
    return response.data;
};

export const getDashboardStats = async () => {
    const response = await API.get(ApiRoute.CLIENT_DASHBOARD_STATS);
    return response.data;
};
