export const ROLES = {
    STUDENT: "STUDENT",
    RECRUITER: "RECRUITER",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
