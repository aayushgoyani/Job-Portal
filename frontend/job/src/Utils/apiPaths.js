export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
        UPDATE_PROFILE: "/api/user/update-profile",
        DELETE_RESUME: "/api/user/resume",
    },

    DASHBOARD: {
        OVERVIEW: `/api/analytics/overview`,
        PLATFORM_STATS: "/api/analytics/platform",
    },

    JOBS: {
        GET_ALL_JOBS: '/api/jobs',
        GET_JOB_By_ID: (id) => `/api/jobs/${id}`,
        POST_JOB: "/api/jobs",
        GET_JOBS_EMPLOYER: "/api/jobs/get-job-employer",
        UPDATE_JOB: (id) => `/api/jobs/${id}`,
        TOGGLE_CLOSE: (id) => `/api/jobs/${id}/toggle-close`,
        DELETE_JOB: (id) => `/api/jobs/${id}`,

        SAVE_JOB: (id) => `/api/save-jobs/${id}`,
        UNSAVE_JOB: (id) => `/api/save-jobs/${id}`,
        GET_SAVED_JOBS: '/api/save-jobs/my',
    },

    APPLICATIONS: {
        APPLY_TO_JOB: (id) => `/api/applications/${id}`,
        GET_MY_APPLICATIONS: "/api/applications/my",
        GET_ALL_APPLICATIONS: (id) => `/api/applications/job/${id}`,
        UPDATE_STATUS: (id) => `/api/applications/${id}/status`,
        DELETE_APPLICATION: (id) => `/api/applications/${id}`,
    },

    IMAGE: {
        
        UPLOAD_IMAGE: "/api/auth/upload-image",
    },
};