import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipsApi, type Internship } from '@/api/internships.api';

export const useRecruiterInternshipDetails = (id: string | undefined) => {
    const navigate = useNavigate();
    const [internship, setInternship] = useState<Internship | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const response = await internshipsApi.getInternshipById(id);
            setInternship(response.data.data);
            setError(null);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError(err.message || 'Failed to fetch internship details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async () => {
        if (!id) return;
        try {
            await internshipsApi.deleteInternship(id);
            setIsDeleteModalOpen(false);
            navigate('/dashboard/recruiter/internships');
        } catch (err: any) {
            alert(err.message || 'Failed to delete internship');
        }
    };

    const stats = internship?.stats || {
        totalApplications: 0,
        shortlisted: 0,
        interviews: 0,
        offersSent: 0
    };

    return {
        internship,
        loading,
        error,
        stats,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        handleDelete,
        navigateBack: () => navigate('/dashboard/recruiter/internships'),
        navigateToApplications: () => navigate(`/dashboard/recruiter/internships/${id}/applications`),
        navigateToEdit: () => navigate(`/dashboard/recruiter/internships/${id}/edit`),
        refetch: fetchData
    };
};
