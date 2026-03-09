import API from '../api/axiosinterceptor';
import type { FreelancerProfileDTO } from '../types/freelancer.dto';

export const createProfile = async (data: FreelancerProfileDTO) => {
    const response = await API.post('/freelancer/freelancerProfile', data);
    return response.data;
};

export const getProfile = async () => {
    const response = await API.get('/freelancer/freelancerProfile');
    return response.data;
};

export const updateProfile = async (data: Partial<FreelancerProfileDTO>) => {
    const response = await API.patch('/freelancer/freelancerProfile', data);
    return response.data;
};

export const requestVerification = async () => {
    const response = await API.post('/freelancer/verify-request');
    return response.data;
};
