import { useState } from 'react';
import { internshipsApi } from '@/api/internships.api';

export const useStudentInternshipActions = () => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const applyForInternship = async (id: string, payload: any) => {
        setSubmitting(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await internshipsApi.applyForInternship(id, payload);
            setSuccessMessage(response.data.message || "Application submitted successfully!");
            return response.data.application;
        } catch (err: any) {
            setError(err.message || "Failed to apply for internship");
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
        applyForInternship,
        clearState
    };
};
