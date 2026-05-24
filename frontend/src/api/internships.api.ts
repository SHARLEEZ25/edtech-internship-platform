import { api } from "./base.api";

/* ===============================
   TYPES
================================ */

export interface Internship {
    id: string;
    title: string;
    description: string;
    domain: string;


    recruiter: {
        id: string; // Added ID
        companyName: string | null;
        city?: string | null;
        state?: string | null;
        companyWebsite?: string | null;
        companyDescription?: string | null;
        professionalTitle?: string | null;
    };

    city: string | null;
    state: string | null;

    internshipType: "REMOTE" | "ONSITE" | "HYBRID";
    workType: "FULL_TIME" | "PART_TIME";

    stipendMin: number | null;
    stipendMax: number | null;
    stipendCurrency: string; // "INR"
    stipendPeriod: string;   // "MONTH" or "HOUR"

    status: "DRAFT" | "LIVE" | "CLOSED";

    durationValue: number;
    durationUnit: "MONTHS" | "WEEKS";
    openings: number;
    skills: string[];
    requirements: string[];
    responsibilities: string[];
    applicationDeadline: string;

    _count?: {
        applications: number;
    };

    createdAt: string;
    updatedAt: string;
    stats?: {
        totalApplications: number;
        shortlisted: number;
        interviews: number;
        offersSent: number;
    };
    hasApplied?: boolean;
    isSaved?: boolean;
}

export interface InternshipFilters {
    page?: number;
    limit?: number;
    search?: string;
    domain?: string;
    location?: string;
    type?: "REMOTE" | "ONSITE" | "HYBRID";
    workType?: "FULL_TIME" | "PART_TIME";
    minStipend?: number;
    status?: string;
    recruiterId?: string;
    includeApplied?: boolean;
}

export interface CreateInternshipPayload {
    title: string;
    description: string;
    domain: string;

    city?: string;
    state?: string;

    internshipType: "REMOTE" | "ONSITE" | "HYBRID";
    workType: "FULL_TIME" | "PART_TIME";

    stipendMin?: number;
    stipendMax?: number;
    stipendCurrency?: string;
    stipendPeriod?: string;

    durationValue?: number;
    durationUnit?: "MONTHS" | "WEEKS";
    openings?: number;
    skills?: string[];
    requirements?: string[];
    responsibilities?: string[];
    applicationDeadline?: string;
    status?: "DRAFT" | "LIVE" | "CLOSED";
}

export type UpdateInternshipPayload = Partial<CreateInternshipPayload> & {
    status?: "DRAFT" | "LIVE" | "CLOSED";
};

export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: boolean;
}

export interface PaginatedResponse<T> {
    internships: T[];
    total: number;
    page: number;
    totalPages: number;
}

export interface Application {
    id: string;
    internshipId: string;
    studentId: string;

    internship?: Partial<Internship>;
    student?: {
        id?: string;
        fullName?: string;
        email?: string;
        collegeName?: string | null;
        degree?: string | null;
        graduationYear?: string | null;
        city?: string | null;
        state?: string | null;
        skills?: any[];
        user?: {
            fullName: string;
            email: string;
            profilePicture?: string | null;
        };
    };

    status: "APPLIED" | "UNDER_REVIEW" | "SHORTLISTED" | "INTERVIEW" | "REJECTED" | "SELECTED" | "WITHDRAWN" | "OFFER_SENT" | "OFFER_ACCEPTED" | "HIRED" | "OFFER_DECLINED";

    fullName: string;
    email: string;
    phone: string | null;
    resumeUrl: string;
    coverLetter: string | null;
    portfolioUrl: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;

    appliedAt: string;
    updatedAt: string;
    remarks?: string | null;
}

export interface RecommendationResult {
    highlighted: (Internship & { reason: string; semanticMatch: number }) | null;
    list: (Internship & { reason: string; semanticMatch: number })[];
}

/* ===============================
   API
================================ */

export const internshipsApi = {
    /* ---------- General / Shared Routes ---------- */

    /**
     * GET /internships
     * Returns paginated object directly { internships: [], total: ... }
     */
    getAllInternships: (params?: InternshipFilters) =>
        api.get<PaginatedResponse<Internship>>("/internships", { params }),

    /**
     * GET /internships/:id
     * Returns { data: Internship }
     */
    getInternshipById: (id: string) =>
        api.get<ApiResponse<Internship>>(`/internships/${id}`),

    /* ---------- Student Routes ---------- */

    /**
     * GET /internships/my-applications
     * Returns { data: Application[] }
     */
    getMyApplications: () =>
        api.get<ApiResponse<Application[]>>("/internships/my-applications"),

    getRecommendedInternships: () =>
        api.get<ApiResponse<Internship[]>>("/internships/recommended"),

    getSemanticRecommendations: () =>
        api.get<ApiResponse<RecommendationResult>>("/recommendations"),

    /**
     * POST /internships/:id/apply
     * Returns { message: string, application: Application }
     */
    applyForInternship: (id: string, payload: any) =>
        api.post<{ message: string; application: Application }>(`/internships/${id}/apply`, payload),

    withdrawApplication: (id: string) =>
        api.post<{ message: string }>(`/internships/${id}/withdraw`, {}),

    saveInternship: (id: string) =>
        api.post<{ message: string }>(`/internships/${id}/save`, {}),

    unsaveInternship: (id: string) =>
        api.delete<{ message: string }>(`/internships/${id}/unsave`),

    getSavedInternships: () =>
        api.get<{ data: Internship[] }>('/internships/saved'),

    /* ---------- Recruiter Routes ---------- */

    /**
     * POST /internships
     * Returns { message: string, data: Internship }
     */
    createInternship: (data: CreateInternshipPayload) =>
        api.post<ApiResponse<Internship>>("/internships", data),

    /**
     * PATCH /internships/:id
     * Returns { message: string, data: Internship }
     */
    updateInternship: (id: string, data: UpdateInternshipPayload) =>
        api.patch<ApiResponse<Internship>>(`/internships/${id}`, data),

    deleteInternship: (id: string) =>
        api.delete<{ message: string }>(`/internships/${id}`),

    /**
     * GET /internships/:id/applications
     * Returns { data: Application[] }
     */
    getInternshipApplications: (id: string) =>
        api.get<ApiResponse<Application[]>>(`/internships/${id}/applications`),

    getRecruiterApplicationsGlobal: () =>
        api.get<ApiResponse<Application[]>>("/applications/recruiter"),

    getRecruiterApplicationById: (applicationId: string) =>
        api.get<ApiResponse<Application>>(`/applications/${applicationId}`),

    updateApplicationStatus: (id: string, payload: { status: string; remarks?: string }) =>
        api.patch<{ message: string; data: Application }>(`/applications/${id}/status`, payload),

    updateApplicationRemarks: (id: string, remarks: string) =>
        api.patch<{ message: string; data: Application }>(`/applications/${id}/remarks`, { remarks }),
};