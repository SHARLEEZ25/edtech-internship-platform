import { api } from "./base.api";

export interface Experience {
    id: string;
    title: string;
    company: string;
    duration?: string; // Optional: calculated from dates
    description: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean; // Frontend helper
    startMonth?: string;
    startYear?: string;
    endMonth?: string | null;
    endYear?: string | null;
}

export interface Achievement {
    id: string;
    title: string;
    issuer: string;
    icon: string;
    category?: 'PREMIUM' | 'VERIFIED' | 'AWARD' | 'STAR';
}

export interface Engagement {
    id: string;
    title: string;
    detail: string;
    tag: string;
    icon: string;
}

export interface StudentProfileData {
    experiences: Experience[];
    achievements: Achievement[];
    engagements: Engagement[];
    skills: string[];
    about: string;
    headline: string;
    profileStrength?: number;
    links?: {
        linkedin?: string;
        github?: string;
        portfolio?: string;
    };
    [key: string]: any;
}

const BASE_URL = "/student-profile";

export const studentProfileApi = {
    // 1. View & Update Profile
    getProfile: () => api.get<{ data: StudentProfileData }>(`${BASE_URL}/details`),
    getStudentProfileById: (studentId: string) => api.get<{ data: StudentProfileData }>(`${BASE_URL}/view/${studentId}`),

    updateBasicProfile: (data: {
        headline?: string; // mapped to primaryRole
        about?: string;    // mapped to bio 
        degree?: string;
        collegeName?: string;
        city?: string;
        state?: string;
        specialization?: string;
        linkedinUrl?: string; // backend might expect this key
        githubUrl?: string;
        portfolioUrl?: string;
    }) => api.put(`${BASE_URL}/basic`, data),

    updateSkills: (skills: string[]) => api.put(`${BASE_URL}/skills`, { skills }),

    // 2. Experience
    addExperience: (data: Omit<Experience, 'id'>) => api.post(`${BASE_URL}/experience`, data),
    updateExperience: (id: string, data: Partial<Experience>) => api.put(`${BASE_URL}/experience/${id}`, data),
    deleteExperience: (id: string) => api.delete(`${BASE_URL}/experience/${id}`),

    // 3. Achievements
    addAchievement: (data: Omit<Achievement, 'id'>) => api.post(`${BASE_URL}/achievement`, data),
    updateAchievement: (id: string, data: Partial<Achievement>) => api.put(`${BASE_URL}/achievement/${id}`, data),
    deleteAchievement: (id: string) => api.delete(`${BASE_URL}/achievement/${id}`),

    // 4. Engagements
    addEngagement: (data: Omit<Engagement, 'id'>) => api.post(`${BASE_URL}/engagement`, data),
    updateEngagement: (id: string, data: Partial<Engagement>) => api.put(`${BASE_URL}/engagement/${id}`, data),
    deleteEngagement: (id: string) => api.delete(`${BASE_URL}/engagement/${id}`),
};
