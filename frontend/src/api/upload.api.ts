import { api } from "./base.api";
import axios from "axios";

interface PresignedUrlResponse {
    uploadUrl: string;
    key: string;
}

export const uploadApi = {
    /**
     * Get a presigned URL for uploading a file
     */
    getPresignedUrl: (fileName: string, fileType: string) =>
        api.get<{ success: boolean; data: PresignedUrlResponse } & PresignedUrlResponse>(
            `/upload/presigned-url`,
            { params: { fileName, fileType } }
        ),

    /**
     * Upload the file binary to the presigned URL
     */
    uploadFile: (url: string, file: File) =>
        axios.put(url, file, {
            headers: {
                "Content-Type": file.type,
            },
        }),

    /**
     * Get the full URL for viewing/downloading a file
     */
    getFileUrl: (key: string) => {
        if (!key) return '';
        if (key.startsWith('http')) return key;
        // Assuming local dev for now, or relative path
        // Ideally use import.meta.env.VITE_API_URL but hardcoding for stability in this debug
        return `http://localhost:5000/api/upload/local/${encodeURIComponent(key)}`;
    }
};
