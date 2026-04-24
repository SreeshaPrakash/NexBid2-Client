import API from '../api/axiosinterceptor';
import type { FreelancerProfileDTO } from '../types/freelancer.dto';
import { ApiRoute } from '../constants/apiConstants';

export const createProfile = async (data: FreelancerProfileDTO) => {
    const response = await API.post(ApiRoute.FREELANCER_PROFILE, data);
    return response.data;
};

export const getProfile = async () => {
    const response = await API.get(ApiRoute.FREELANCER_PROFILE);
    return response.data;
};

export const updateProfile = async (data: Partial<FreelancerProfileDTO>) => {
    const response = await API.patch(ApiRoute.FREELANCER_PROFILE, data);
    return response.data;
};

export const requestVerification = async () => {
    const response = await API.post(ApiRoute.FREELANCER_VERIFY_REQUEST);
    return response.data;
};

export const getDashboardStats = async () => {
    const response = await API.get(ApiRoute.FREELANCER_DASHBOARD_STATS);
    return response.data;
};
