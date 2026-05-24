import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipsApi, type Internship } from '@/api/internships.api';

export const useSavedInternships = () => {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null); // To track which ID is being unsaved
    const navigate = useNavigate();

    const fetchSaved = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await internshipsApi.getSavedInternships();
            setInternships(response.data.data || []);
        } catch (err: any) {
            console.error('Failed to fetch saved internships', err);
            setError('Failed to load saved internships');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSaved();
    }, [fetchSaved]);

    const handleUnsave = useCallback(async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setActionLoading(id);
            await internshipsApi.unsaveInternship(id);
            setInternships(prev => prev.filter(i => i.id !== id));
        } catch (err) {
            console.error('Failed to unsave internship', err);
            // Instead of alert, we'll keep the error in state to be displayed by the visual
            setError('Failed to unsave internship. Please try again.');
        } finally {
            setActionLoading(null);
        }
    }, []);

    const handleNavigateToDetails = useCallback((id: string) => {
        navigate(`/dashboard/student/internships/${id}`);
    }, [navigate]);

    const handleNavigateToBrowse = useCallback(() => {
        navigate('/dashboard/student/internships');
    }, [navigate]);

    return {
        internships,
        loading,
        error,
        actionLoading,
        handleUnsave,
        handleNavigateToDetails,
        handleNavigateToBrowse,
        refetch: fetchSaved
    };
};
