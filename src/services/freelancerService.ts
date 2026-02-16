import API from '../api/axiosinterceptor';
import type { FreelancerProfileDTO } from '../types/freelancer.dto';

// Note: Backend routes for freelancers might need to be mounted at /api/freelancer or similar.
// Assuming /api/freelancer based on other route patterns.

export const createProfile = async (data: FreelancerProfileDTO) => {
    const response = await API.post('/freelancer/freelancerProfile', data);
    return response.data;
};

export const getProfile = async () => {
    const response = await API.get('/freelancer/freelancerProfile');
    return response.data;
};

export const requestVerification = async () => {
    const response = await API.post('/freelancer/verify-request');
    return response.data;
};
