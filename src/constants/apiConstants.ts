export const ApiRoute = {
    // Auth Routes
    SIGNUP: '/signup',
    VERIFY_OTP: '/verify-otp',
    LOGIN: '/login',
    RESEND_OTP: '/resend-otp',
    REFRESH_TOKEN: '/refresh-token',
    GOOGLE_LOGIN: '/auth/google',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    SWITCH_ROLE: '/switch-role',
    LOGOUT: '/logout',

    // Admin Routes
    ADMIN_LOGIN: '/admin/login',
    ADMIN_GET_ALL_USERS: '/admin/getAllUsers',
    ADMIN_GET_USER_BY_ID: '/admin/getUserById',
    ADMIN_BLOCK_STATUS: '/admin/block-status',
    ADMIN_VERIFICATION_REQUESTS: '/admin/verification-requests',
    ADMIN_FREELANCER_PROFILE: '/admin/freelancer-profile',
    ADMIN_APPROVE_VERIFICATION: '/admin/approve-verification',
    ADMIN_REJECT_VERIFICATION: '/admin/reject-verification',

    // Client Routes
    CLIENT_PROFILE: '/client/clientprofile',
    CLIENT_DASHBOARD_STATS: '/client/dashboard-stats',

    // Freelancer Routes
    FREELANCER_PROFILE: '/freelancer/freelancerProfile',
    FREELANCER_VERIFY_REQUEST: '/freelancer/verify-request',
    FREELANCER_DASHBOARD_STATS: '/freelancer/dashboard-stats',

    // Project Routes
    PROJECT_CREATE: '/project/create',
    PROJECT_LIST: '/project/list',
    PROJECT_OPEN: '/project/openProjects',
    PROJECT_BASE: '/project',
    PROJECT_UPDATE: '/project/update',
    
    // Skill Routes
    SKILLS: '/skills',

    // S3 Routes
    S3_PRESIGNED_URL: '/s3/presigned-url'
} as const;
