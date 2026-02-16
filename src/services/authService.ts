import API from '../api/axiosinterceptor';
import type { RegisterDTO, LoginDTO, AuthResponse, GoogleLoginResponseDTO, ResetPasswordDTO } from '../types/auth.dto';

export const signupUser = async (data: RegisterDTO): Promise<AuthResponse> => {
    const response = await API.post('/signup', data);
    return response.data;
};

export const verifyOtp = async (email: string, otp: string): Promise<AuthResponse> => {
    const response = await API.post('/verify-otp', { email, otp });
    return response.data;
};

export const loginUser = async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await API.post('/login', data);
    return response.data;
};

export const resendOtp = async (email: string): Promise<{ message: string }> => {
    const response = await API.post('/resend-otp', { email });
    return response.data;
};

export const refreshToken = async (): Promise<AuthResponse> => {
    const response = await API.post('/refresh-token');
    return response.data;
};

export const googleLogin = async (idToken: string): Promise<GoogleLoginResponseDTO> => {
    const response = await API.post('/auth/google', { idToken });
    return response.data;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
    const response = await API.post('/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (data: ResetPasswordDTO): Promise<{ message: string }> => {
    const response = await API.post('/reset-password', data);
    return response.data;
};

export const switchRole = async (role: string): Promise<any> => {
    const response = await API.post('/switch-role', { requestedRole: role });
    return response.data;
};

// export const logout = async () => {
//   // Implement logout logic if backend has an endpoint, otherwise client-side only
// };
