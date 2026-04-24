import { z } from "zod";
import { ProjectVisibility } from "../constants/projectConstants";

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

export const clientProfileSchema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format").or(z.literal('')).optional(),
    country: z.string().min(2, "Country is required").or(z.literal('')).optional(),
    state: z.string().min(2, "State is required").or(z.literal('')).optional(),
    profileImage: z.string().optional()
});

export const freelancerProfileSchema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    title: z.string().trim().min(3, "Title must be at least 3 characters"),
    bio: z.string().trim().min(10, "Summary must be at least 10 characters"),
    experienceInYears: z.number().min(0, "Experience cannot be negative"),
    experiences: z.array(z.object({
        title: z.string().min(3, "Experience title must be at least 3 characters"),
        description: z.string().min(10, "Experience description must be at least 10 characters")
    })).min(1, "At least one experience is required"),
    country: z.string().min(2, "Country is required").or(z.literal('')).optional(),
    state: z.string().min(2, "State/City is required").or(z.literal('')).optional(),
    phone: z.string().regex(/^\+?[0-9\s-]{7,15}$/, "Invalid phone number").or(z.literal('')).optional(),
    portfolio: z.union([z.literal(''), z.string().url("Invalid URL").optional()]),
    gitHubUrl: z.union([z.literal(''), z.string().url("Invalid URL").optional()]),
    linkedinUrl: z.union([z.literal(''), z.string().url("Invalid URL").optional()]),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    previousWorks: z.array(z.string()).optional(),
    profileImage: z.string().optional()
});



export const projectSchema = z.object({
    title: z.string().trim().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
    description: z.string().trim().min(20, "Description must be at least 20 characters"),
    budget: z.number().min(1, "Budget must be at least 1"),
    skillsRequired: z.array(z.string()).min(1, "At least one skill is required"),
    biddingDeadline: z.string().min(1, "Bidding deadline is required"),
    deadline: z.string().optional().nullable(),
    visibility: z.nativeEnum(ProjectVisibility).default(ProjectVisibility.PUBLIC),
    attachments: z.array(z.string()).optional(),
});

export const bidSchema = z.object({
    bidAmount: z.number().min(1, "Bid amount must be at least 1"),
    deliveryTime: z.number().min(1, "Delivery time must be at least 1 day"),
    message: z.string().trim().min(20, "Cover letter must be at least 20 characters"),
});
