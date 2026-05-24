import { useState, useEffect, useCallback } from 'react';
import { internshipsApi, type Internship, type InternshipFilters, type PaginatedResponse } from '../../api/internships.api';

export const useInternships = (initialFilters: InternshipFilters = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<PaginatedResponse<Internship> | null>(null);
    const [filters, setFilters] = useState<InternshipFilters>(initialFilters);

    const fetchInternships = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await internshipsApi.getAllInternships(filters);
            setData(response.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch internships");
            // Optional: Handle token expiration or specific error codes here if needed
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchInternships();
    }, [fetchInternships]);

    const updateFilters = (newFilters: Partial<InternshipFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 on filter change
    };

    const setPage = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    return {
        loading,
        error,
        internships: data?.internships || [],
        total: data?.total || 0,
        page: data?.page || 1,
        totalPages: data?.totalPages || 1,
        filters,
        updateFilters,
        setPage,
        refetch: fetchInternships
    };
};
