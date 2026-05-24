import { api } from "./base.api";

export interface RecruiterAchievementPayload {
    label: string;
    icon: string;
    colorClass: string;
}

export interface RecruiterEngagementPayload {
    title: string;
    subtitle: string;
    status: 'UPCOMING' | 'COMPLETED';
    icon: string;
}

export interface RecruiterProfileUpdatePayload {
    companyName?: string;
    companyDescription?: string;
    companyWebsite?: string;
    professionalTitle?: string;
    city?: string;
    state?: string;
    hiringRoles?: string[];
    linkedinUrl?: string;
    twitterUrl?: string;
    studentsHired?: number;
    activePostings?: number;
    retentionRate?: number;
    yearsOfExperience?: number;
}

export const recruitersApi = {
    updateProfile: (data: RecruiterProfileUpdatePayload) =>
        api.patch("/users/recruiters/profile", data),

    addAchievement: (data: RecruiterAchievementPayload) =>
        api.post("/users/recruiters/achievements", data),

    deleteAchievement: (id: string) =>
        api.delete(`/users/recruiters/achievements/${id}`),

    addEngagement: (data: RecruiterEngagementPayload) =>
        api.post("/users/recruiters/engagements", data),

    updateEngagement: (id: string, data: Partial<RecruiterEngagementPayload>) =>
        api.patch(`/users/recruiters/engagements/${id}`, data),

    deleteEngagement: (id: string) =>
        api.delete(`/users/recruiters/engagements/${id}`),
};
