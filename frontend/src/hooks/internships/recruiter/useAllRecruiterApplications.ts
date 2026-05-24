import { useState, useEffect, useCallback } from 'react';
import { internshipsApi, type Application } from '@/api/internships.api';

export const useAllRecruiterApplications = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);

    const fetchAllApplications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await internshipsApi.getRecruiterApplicationsGlobal();
            setApplications(response.data.data);
        } catch (err: any) {
            console.error('Error fetching recruiter applications:', err);
            setError(err.message || 'Failed to fetch all applications');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllApplications();
    }, [fetchAllApplications]);

    return {
        loading,
        error,
        applications,
        count: applications.length,
        refetch: fetchAllApplications
    };
};
