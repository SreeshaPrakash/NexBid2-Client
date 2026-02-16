export interface GetUserQueryDTO {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface BlockUserDTO {
    userId: string;
    isBlocked: boolean;
}
