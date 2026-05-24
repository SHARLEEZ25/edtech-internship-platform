import { api } from "./base.api";

export const usersApi = {
    getRecruiterProfile: (id: string) =>
        api.get(`/users/recruiters/${id}`),

    getStudentProfile: (id: string) =>
        api.get(`/users/students/${id}`),
};
