import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipsApi, type Internship, type InternshipFilters, type PaginatedResponse } from '@/api/internships.api';
import {
    getStatusClass,
    getStatusLabel,
    formatStipend,
    formatDuration,
    getLocationDisplay,
    getApplicantMessage
} from '@/utils/internshipFormatters';
import { type FormattedInternshipCard } from '@/components/internships/recruiter';

export const useRecruiterInternships = (initialFilters: InternshipFilters = {}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<PaginatedResponse<Internship> | null>(null);
    const [filters, setFilters] = useState<InternshipFilters>(initialFilters);

    // UI Local State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchMyInternships = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Backend automatically masks for recruiter's own posts
            const response = await internshipsApi.getAllInternships(filters);
            setData(response.data);
        } catch (err: any) {
            console.error('Failed to fetch internships:', err);
            setError(err.message || "Failed to fetch your internships");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchMyInternships();
    }, [fetchMyInternships]);

    // 1. Filter Logic (Done on frontend for now for better UX on search)
    const filteredInternships = useMemo(() => {
        const rawList = data?.internships || [];
        let filtered = rawList;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(internship =>
                internship.title.toLowerCase().includes(query) ||
                internship.domain.toLowerCase().includes(query) ||
                internship.skills?.some(skill => skill.toLowerCase().includes(query))
            );
        }

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(internship => internship.status === statusFilter);
        }

        return filtered;
    }, [data?.internships, searchQuery, statusFilter]);

    // 2. Formatting Logic (Pure visual mapping)
    const formattedInternships = useMemo((): FormattedInternshipCard[] => {
        return filteredInternships.map(internship => ({
            internship,
            statusClass: getStatusClass(internship.status),
            statusLabel: getStatusLabel(internship.status),
            locationDisplay: getLocationDisplay(internship),
            stipendDisplay: formatStipend(internship),
            durationDisplay: formatDuration(internship),
            applicantCount: internship._count?.applications || 0,
            applicantMessage: getApplicantMessage(internship._count?.applications || 0, internship.status),
            applicants: []
        }));
    }, [filteredInternships]);

    // Actions
    const updateFilters = (newFilters: Partial<InternshipFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const setPage = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    return {
        // Data states
        loading,
        error,
        internships: filteredInternships,
        formattedInternships,
        isFirstTime: !loading && (data?.total || 0) === 0 && !searchQuery && statusFilter === 'ALL',

        // Pagination
        total: data?.total || 0,
        page: data?.page || 1,
        totalPages: data?.totalPages || 1,

        // Filter actions/state
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        updateFilters,
        setPage,
        clearFilters: () => {
            setSearchQuery('');
            setStatusFilter('ALL');
        },

        // Navigation actions
        handleCreate: () => navigate('/dashboard/recruiter/internships/new'),
        handleEdit: (id: string) => navigate(`/dashboard/recruiter/internships/${id}/edit`),
        handleView: (id: string) => navigate(`/dashboard/recruiter/internships/${id}`),

        refetch: fetchMyInternships
    };
};
