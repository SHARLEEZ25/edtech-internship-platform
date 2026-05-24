import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipsApi } from '@/api/internships.api';
import { useInternshipForm } from './useInternshipForm';
import { type InternshipFormData } from '@/components/internships/recruiter';
import { transformInternshipDataForBackend } from '@/utils/internshipUtils';

export const usePostInternship = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (data: InternshipFormData) => {
        setSubmitting(true);
        setError(null);
        try {
            const payload = transformInternshipDataForBackend(data);

            // Additional defaults for new posts if not in form
            if (!payload.stipendCurrency) payload.stipendCurrency = "INR";
            if (!payload.workType) payload.workType = "FULL_TIME";

            await internshipsApi.createInternship(payload);
            navigate('/dashboard/recruiter/internships');
        } catch (err: any) {
            console.error('Post error:', err);
            setError(err.message || 'Failed to post internship');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setSubmitting(false);
        }
    }, [navigate]);

    const form = useInternshipForm({
        onSubmit: handleSubmit
    });

    return {
        ...form,
        submitting,
        error,
        navigateBack: () => navigate('/dashboard/recruiter/internships')
    };
};
