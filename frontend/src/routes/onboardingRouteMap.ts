/**
 * Single source of truth for onboarding routes.
 * Maps backend step names to frontend route paths.
 */

export const ONBOARDING_BASE_PATH = "/onboarding";

export const ONBOARDING_ROUTES = {
    ROLE_SELECTION: ONBOARDING_BASE_PATH,

    // Student Flow
    STUDENT_EDUCATION: `${ONBOARDING_BASE_PATH}/student/education`,
    STUDENT_SKILLS: `${ONBOARDING_BASE_PATH}/student/skills`,
    STUDENT_LOCATION: `${ONBOARDING_BASE_PATH}/student/location`,

    // Recruiter Flow
    RECRUITER_PROFESSIONAL: `${ONBOARDING_BASE_PATH}/recruiter/professional`,
    RECRUITER_COMPANY: `${ONBOARDING_BASE_PATH}/recruiter/company`,
    RECRUITER_DESCRIPTION: `${ONBOARDING_BASE_PATH}/recruiter/description`,
    RECRUITER_FINAL: `${ONBOARDING_BASE_PATH}/recruiter/final`,

    // Final Destination
    COMPLETED: "/dashboard",
} as const;

export type OnboardingRouteKey = keyof typeof ONBOARDING_ROUTES;

/**
 * Helper to get the absolute path for a given onboarding step.
 * If the step is not found, it defaults to the role selection page.
 */
export const getOnboardingPath = (step: string): string => {
    return ONBOARDING_ROUTES[step as OnboardingRouteKey] || ONBOARDING_ROUTES.ROLE_SELECTION;
};
