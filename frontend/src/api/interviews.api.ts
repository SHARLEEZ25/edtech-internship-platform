import { api } from "./base.api";
import type { ApiResponse } from "./internships.api";

/* ===============================
   TYPES
================================ */

export interface ScheduleInterviewPayload {
    applicationId: string;
    date: string; // ISO 8601 String ending in 'Z' (UTC)
    duration?: number; // Duration in minutes, default 30
    mode: string; // e.g., "Virtual", "In-Person"
    link?: string; // Meeting link
    notes?: string;
}

export interface Interview {
    id: string;
    applicationId: string;
    date: string;
    duration: number;
    mode: string;
    link?: string;
    notes?: string;
    status: string;
    createdAt: string;
    updatedAt: string;

    // Joined details based on user role (Flat)
    studentName?: string;
    studentProfilePic?: string;
    companyName?: string;
    internshipTitle?: string;

    // Potential Nested Structure (Fallback)
    application?: {
        student?: {
            user?: {
                fullName: string;
                profilePic?: string;
            };
        };
        internship?: {
            title: string;
            company?: {
                name: string;
            };
        };
    };
    recruiter?: {
        recruiterProfile?: {
            companyName?: string;
            designation?: string;
            user?: {
                fullName: string;
            };
        };
    };
}

/* ===============================
   API
================================ */

export const interviewsApi = {
    /**
     * POST /interviews/schedule
     * (Recruiter Only) Schedule a new interview
     */
    scheduleInterview: (payload: ScheduleInterviewPayload) =>
        api.post<ApiResponse<Interview>>("/interviews/schedule", payload),

    /**
     * GET /interviews/my-interviews
     * (Shared) Get interviews for the current user
     */
    getMyInterviews: () =>
        api.get<ApiResponse<Interview[]>>("/interviews/my-interviews"),

    /**
     * GET /interviews/:id
     * (Shared) Get single interview details
     */
    getInterviewById: (id: string) =>
        api.get<ApiResponse<Interview>>(`/interviews/${id}`),

    /**
     * PUT /interviews/:id/respond
     * (Student) Accept or decline an interview invitation
     */
    respondToInterview: (id: string, body: { response: 'ACCEPT' | 'DECLINE' }) =>
        api.put<ApiResponse<Interview>>(`/interviews/${id}/respond`, body),

    /**
     * POST /interviews/:id/complete
     * (Recruiter) Mark an interview as completed
     */
    completeInterview: (id: string) =>
        api.post<ApiResponse<Interview>>(`/interviews/${id}/complete`),

    /**
     * POST /interviews/:id/cancel
     * (Recruiter) Cancel a scheduled interview
     */
    cancelInterview: (id: string, body?: { reason?: string }) =>
        api.post<ApiResponse<Interview>>(`/interviews/${id}/cancel`, body),

    /**
     * POST /interviews/:id/reschedule
     * (Recruiter) Reschedule an interview to a new date/time
     */
    rescheduleInterview: (id: string, body: { date: string; link?: string; notes?: string }) =>
        api.post<ApiResponse<Interview>>(`/interviews/${id}/reschedule`, body),
};
