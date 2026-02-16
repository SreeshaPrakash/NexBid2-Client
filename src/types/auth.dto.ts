export interface RegisterDTO {
    name?: string;
    email: string;
    password?: string;
    role: string;
}

export interface LoginDTO {
    email: string;
    password?: string;
    role?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: any;
    accessToken?: string;
    refreshToken?: string;
    isNewUser?: boolean;
}

export interface GoogleLoginResponseDTO {
    success: boolean;
    message: string;
    user: any;
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
}

export interface ResetPasswordDTO {
    email: string;
    otp: string;
    newPassword: string;
}
