import { useState, useEffect, useCallback } from 'react';
import { internshipsApi, type Internship } from '../../../api/internships.api';

export const useInternshipDetails = (id: string | undefined) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [internship, setInternship] = useState<Internship | null>(null);

    const fetchInternship = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError(null);
        try {
            const response = await internshipsApi.getInternshipById(id);
            setInternship(response.data.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch internship details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchInternship();
    }, [fetchInternship]);

    return {
        loading,
        error,
        internship,
        refetch: fetchInternship
    };
};
