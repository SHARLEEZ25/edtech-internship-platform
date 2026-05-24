import { api } from "./base.api";

/* ===============================
   TYPES (mirror backend enums)
================================ */

import type { RoleType } from "@/utils/constants";

export type BackendRole = RoleType;

export type OnboardingStep =
  | "ROLE_SELECTION"
  | "STUDENT_EDUCATION"
  | "STUDENT_SKILLS"
  | "STUDENT_LOCATION"
  | "RECRUITER_PROFESSIONAL"
  | "RECRUITER_COMPANY"
  | "RECRUITER_DESCRIPTION"
  | "COMPLETED";

/* ===============================
   API
================================ */

export const onboardingApi = {
  /* ---------- Role ---------- */
  selectRole: (role: BackendRole) =>
    api.post("/onboarding/select-role", { role }),

  /* ---------- Student ---------- */
  saveStudentEducation: (data: {
    collegeName: string;
    degree: string;
    graduationYear: number;
    specialization?: string;
  }) =>
    api.post("/students/onboarding/education", data),

  saveStudentSkills: (data: {
    skills: string[];
  }) =>
    api.post("/students/onboarding/skills", data),

  saveStudentLocation: (data: {
    city: string;
    state: string;
  }) =>
    api.post("/students/onboarding/location", data),

  /* ---------- Recruiter ---------- */
  saveRecruiterProfessional: (data: {
    professionalTitle: string;
  }) =>
    api.post("/recruiters/onboarding/professional", data),

  saveRecruiterCompany: (data: {
    companyName: string;
    city: string;
    state: string;
  }) =>
    api.post("/recruiters/onboarding/company", data),

  saveRecruiterDescription: (data: {
    companyDescription: string;
    companyWebsite?: string;
  }) =>
    api.post("/recruiters/onboarding/description", data),
};
