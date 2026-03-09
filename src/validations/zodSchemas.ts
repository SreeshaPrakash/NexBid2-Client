import { z } from "zod";

// Shared patterns
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = z.object({
    email: z.string().trim().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
    name: z.string().trim().min(1, "Full Name is required").min(3, "Name must be at least 3 characters"),
    email: z.string().trim().min(1, "Email is required"),
    password: z.string().trim().min(1, "Password is required"),
    confirmPassword: z.string().trim().min(1, "Confirm Password is required"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().trim().min(1, "Email is required"),
});

export const resetPasswordSchema = z.object({
    otp: z.string().trim().length(6, "OTP must be exactly 6 digits"),
    newPassword: z.string().min(1, "New Password is required"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
});

// Helper for "Toaster" level validations that are still client-side
export const isValidEmailFormat = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isPasswordComplex = (password: string) => {
    return passwordPattern.test(password);
};
