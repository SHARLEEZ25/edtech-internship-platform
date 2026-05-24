import { useState } from 'react';
import { internshipsApi, type CreateInternshipPayload, type UpdateInternshipPayload } from '../../api/internships.api';

export const useInternshipActions = () => {
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
            setError(err.message || "Failed to create internship");
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
            setError(err.message || "Failed to update internship");
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    // The API signature for payload is 'any' in api definition but we can refine it if we know the structure
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
        createInternship,
        updateInternship,
        applyForInternship,
        clearState
    };
};
