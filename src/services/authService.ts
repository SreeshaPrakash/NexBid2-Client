import API from '../api/axiosinterceptor';
import type { RegisterDTO, LoginDTO, AuthResponse, GoogleLoginResponseDTO, ResetPasswordDTO } from '../types/auth.dto';
import { ApiRoute } from '../constants/apiConstants';

export const signupUser = async (data: RegisterDTO): Promise<AuthResponse> => {
    const response = await API.post(ApiRoute.SIGNUP, data);
    return response.data;
};

export const verifyOtp = async (email: string, otp: string): Promise<AuthResponse> => {
    const response = await API.post(ApiRoute.VERIFY_OTP, { email, otp });
    return response.data;
};


export const loginUser = async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await API.post(ApiRoute.LOGIN, data);
    return response.data;
};

export const resendOtp = async (email: string): Promise<{ message: string }> => {
    const response = await API.post(ApiRoute.RESEND_OTP, { email });
    return response.data;
};

export const refreshToken = async (url: string = ApiRoute.REFRESH_TOKEN): Promise<AuthResponse> => {
    const response = await API.post(url);
    return response.data;
};

export const googleLogin = async (idToken: string): Promise<GoogleLoginResponseDTO> => {
    const response = await API.post(ApiRoute.GOOGLE_LOGIN, { idToken });
    return response.data;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
    const response = await API.post(ApiRoute.FORGOT_PASSWORD, { email });
    return response.data;
};

export const resetPassword = async (data: ResetPasswordDTO): Promise<{ message: string }> => {
    const response = await API.post(ApiRoute.RESET_PASSWORD, data);
    return response.data;
};

export const switchRole = async (role: string): Promise<any> => {
    const response = await API.post(ApiRoute.SWITCH_ROLE, { requestedRole: role });
    return response.data;
};

export const logout = async (): Promise<void> => {
    await API.post(ApiRoute.LOGOUT);
};
