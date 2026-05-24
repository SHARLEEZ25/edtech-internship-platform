import { useState, useEffect, useCallback, useRef } from 'react';
import { internshipsApi, type Internship, type InternshipFilters, type PaginatedResponse } from '@/api/internships.api';

export const useStudentInternships = (initialFilters: InternshipFilters = {}) => {
    const [loading, setLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<PaginatedResponse<Internship> | null>(null);
    const [filters, setFilters] = useState<InternshipFilters>(initialFilters);
    const [debouncedSearch, setDebouncedSearch] = useState(initialFilters.search || '');

    // Ref to track if it's the first render to avoid double fetch on start
    const isFirstRender = useRef(true);

    const fetchInternships = useCallback(async (currentFilters: InternshipFilters) => {
        setLoading(true);
        setError(null);
        try {
            const response = await internshipsApi.getAllInternships(currentFilters);
            setData(response.data);
            setIsInitialLoading(false);
        } catch (err: any) {
            setError(err.message || "Failed to fetch internships");
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect for non-search filters (immediate)
    useEffect(() => {
        const { search, ...restFilters } = filters;
        // Skip search in this effect, handle it via debouncedSearch
        fetchInternships({ ...restFilters, search: debouncedSearch });
    }, [filters.domain, filters.location, filters.type, filters.minStipend, filters.page, debouncedSearch, fetchInternships]);

    // Handle debouncing search
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search || '');
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [filters.search]);

    const updateFilters = (newFilters: Partial<InternshipFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const setPage = (pageNumber: number) => {
        const totalPages = data?.totalPages || 1;
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setFilters(prev => ({ ...prev, page: pageNumber }));
    };

    const clearFilters = () => {
        setFilters(initialFilters);
        setDebouncedSearch(initialFilters.search || '');
    };

    return {
        loading,
        isInitialLoading,
        error,
        internships: data?.internships || [],
        total: data?.total || 0,
        page: data?.page || 1,
        totalPages: data?.totalPages || 1,
        filters,
        updateFilters,
        setPage,
        clearFilters,
        refetch: () => fetchInternships({ ...filters, search: debouncedSearch })
    };
};
