import { useState } from 'react';
import { internshipsApi, type CreateInternshipPayload, type UpdateInternshipPayload } from '@/api/internships.api';

export const useRecruiterInternshipActions = () => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const createInternship = async (data: CreateInternshipPayload) => {
        setSubmitting(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await internshipsApi.createInternship(data);
            setSuccessMessage("Internship created successfully!");
            return response.data.data;
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Failed to create internship";
            setError(msg);
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const updateInternship = async (id: string, data: UpdateInternshipPayload) => {
        setSubmitting(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await internshipsApi.updateInternship(id, data);
            setSuccessMessage("Internship updated successfully!");
            return response.data.data;
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Failed to update internship";
            setError(msg);
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const clearState = () => {
        setError(null);
        setSuccessMessage(null);
    };

    return {
        submitting,
        error,
        successMessage,
        createInternship,
        updateInternship,
        clearState
    };
};
