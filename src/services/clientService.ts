import API from '../api/axiosinterceptor';
import type { ClientProfileDTO } from '../types/client.dto';

export const getClientProfile = async () => {
    const response = await API.get('/client/clientprofile');
    return response.data;
};

export const updateClientProfile = async (data: Partial<ClientProfileDTO>) => {
    const response = await API.patch('/client/clientprofile', data);
    return response.data;
};
