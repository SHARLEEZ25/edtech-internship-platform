import { api } from "./base.api";

export interface Skill {
    id: string;
    name: string;
    category: string;
}

export interface GroupedSkills {
    category: string;
    skills: Skill[];
}

export const skillsApi = {
    /** Fetch all available skills */
    getSkills: (query?: string) =>
        api.get<GroupedSkills[]>("/skills", {
            params: { query },
            skipGlobalErrorHandler: true // Allow fallback if auth fails
        } as any),

    /** Add a new custom skill */
    addSkill: (data: { name: string; category: string }) =>
        api.post<Skill>("/skills", data),
};
