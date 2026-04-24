export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    roles: string[];
    activeRole?: string;
}

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
    user?: User;
    accessToken?: string;
    refreshToken?: string;
    isNewUser?: boolean;
}

export interface GoogleLoginResponseDTO {
    success: boolean;
    message: string;
    user: User;
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
}

export interface ResetPasswordDTO {
    email: string;
    otp: string;
    newPassword: string;
}
