import axios from "axios";

const envBase = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = envBase
    ? envBase.endsWith("/api")
        ? envBase
        : envBase.replace(/\/$/, "") + "/api"
    : "/api";

export const api = axios.create({
        baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors like 401
        return Promise.reject(error);
    }
);
