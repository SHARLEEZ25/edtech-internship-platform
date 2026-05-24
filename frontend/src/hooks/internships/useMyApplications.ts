import { useState, useEffect, useCallback } from 'react';
import { internshipsApi, type Application } from '../../api/internships.api';

export const useMyApplications = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await internshipsApi.getMyApplications();
            setApplications(response.data.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    return {
        loading,
        error,
        applications,
        refetch: fetchApplications
    };
};
