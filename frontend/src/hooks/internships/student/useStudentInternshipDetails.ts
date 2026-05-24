import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipsApi, type Internship } from '@/api/internships.api';

export const useStudentInternshipDetails = (id: string | undefined) => {
    const navigate = useNavigate();
    const [internship, setInternship] = useState<Internship | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [applicationId, setApplicationId] = useState<string | null>(null);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchDetails = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            const response = await internshipsApi.getInternshipById(id);
            const data = response.data.data;
            setInternship(data);

            // If user has applied, fetch application ID to allow viewing details
            if (data.hasApplied) {
                const appsRes = await internshipsApi.getMyApplications();
                const apps = appsRes.data.data || appsRes.data;
                const myApp = apps.find((a: any) => a.internshipId === id);
                if (myApp) setApplicationId(myApp.id);
            }
        } catch (err: any) {
            console.error('Failed to load internship details', err);
            setError(err.message || 'Failed to load internship details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleSaveToggle = async () => {
        if (!internship) return;
        try {
            setIsActionLoading(true);
            if (internship.isSaved) {
                await internshipsApi.unsaveInternship(internship.id);
                setInternship(prev => prev ? { ...prev, isSaved: false } : null);
            } else {
                await internshipsApi.saveInternship(internship.id);
                setInternship(prev => prev ? { ...prev, isSaved: true } : null);
            }
        } catch (err) {
            console.error('Failed to toggle save', err);
            // In a real app, we might use a toast here
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleWithdrawConfirm = async () => {
        if (!internship) return;
        try {
            setIsActionLoading(true);
            await internshipsApi.withdrawApplication(internship.id);
            setIsWithdrawModalOpen(false);
            navigate('/dashboard/student/internships');
        } catch (err) {
            console.error('Failed to withdraw', err);
            setError('Failed to withdraw application. Please try again.');
            setIsWithdrawModalOpen(false);
        } finally {
            setIsActionLoading(false);
        }
    };

    const formatStipend = () => {
        if (!internship?.stipendMin) return 'Unpaid';
        const min = internship.stipendMin.toLocaleString('en-IN');
        const max = internship.stipendMax ? ` - ${internship.stipendMax.toLocaleString('en-IN')}` : '';
        return `₹${min}${max} / ${internship.stipendPeriod === 'MONTHLY' ? 'month' : 'week'}`;
    };

    const formatDuration = () => {
        if (!internship) return '';
        return `${internship.durationValue} ${internship.durationUnit === 'MONTHS' ? 'Months' : 'Weeks'} Duration`;
    };

    return {
        internship,
        loading,
        error,
        applicationId,
        isWithdrawModalOpen,
        isActionLoading,
        setIsWithdrawModalOpen,
        handleSaveToggle,
        handleWithdrawConfirm,
        formatStipend,
        formatDuration,
        refetch: fetchDetails
    };
};
