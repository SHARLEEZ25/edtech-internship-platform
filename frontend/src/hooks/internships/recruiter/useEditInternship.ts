import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipsApi } from '@/api/internships.api';
import { useInternshipForm } from './useInternshipForm';
import { type InternshipFormData } from '@/components/internships/recruiter';
import { transformInternshipDataForBackend } from '@/utils/internshipUtils';

export const useEditInternship = (id: string | undefined) => {
    const navigate = useNavigate();
    const [fetching, setFetching] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialData, setInitialData] = useState<InternshipFormData | null>(null);

    // Fetch internship data and format for form
    useEffect(() => {
        const fetchInternship = async () => {
            if (!id) return;
            try {
                setFetching(true);
                const response = await internshipsApi.getInternshipById(id);
                const data = response.data.data;

                setInitialData({
                    title: data.title,
                    description: data.description || '',
                    domain: data.domain,
                    city: data.city || '',
                    state: data.state || '',
                    internshipType: data.internshipType,
                    durationValue: data.durationValue,
                    durationUnit: data.durationUnit as any,
                    stipendMin: data.stipendMin,
                    stipendMax: data.stipendMax,
                    openings: data.openings,
                    applicationDeadline: data.applicationDeadline.split('T')[0],
                    skills: data.skills?.join('\n') || '',
                    requirements: data.requirements?.join('\n') || '',
                    responsibilities: data.responsibilities?.join('\n') || '',
                    status: data.status,
                });
            } catch (err: any) {
                console.error('Fetch error:', err);
                setError(err.message || 'Failed to fetch internship details');
            } finally {
                setFetching(false);
            }
        };

        fetchInternship();
    }, [id]);

    // Submission handler
    const handleSubmit = useCallback(async (data: InternshipFormData) => {
        if (!id) return;
        setSubmitting(true);
        setError(null);
        try {
            const payload = transformInternshipDataForBackend(data);
            await internshipsApi.updateInternship(id, payload);
            navigate('/dashboard/recruiter/internships');
        } catch (err: any) {
            console.error('Update error:', err);
            setError(err.message || 'Failed to update internship');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setSubmitting(false);
        }
    }, [id, navigate]);

    // Integrate with base form hook
    const form = useInternshipForm({
        initialData: initialData || undefined,
        onSubmit: handleSubmit
    });

    return {
        ...form,
        fetching,
        submitting,
        error,
        navigateBack: () => navigate('/dashboard/recruiter/internships')
    };
};
