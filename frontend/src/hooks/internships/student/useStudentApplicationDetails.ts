import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipsApi, type Application } from '@/api/internships.api';

export const useStudentApplicationDetails = (id: string | undefined) => {
    const navigate = useNavigate();
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const fetchApplication = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            // Fetch all applications and find the match (safe for students)
            const response = await internshipsApi.getMyApplications();
            const apps = response.data.data || response.data;
            const foundApp = apps.find((app: Application) => app.id === id);

            if (foundApp) {
                setApplication(foundApp);
            } else {
                setError('Application not found or access denied.');
            }
        } catch (err: any) {
            console.error('Failed to fetch application:', err);
            setError(err.message || 'Failed to fetch application details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchApplication();
    }, [fetchApplication]);

    const handleWithdrawConfirm = async () => {
        if (!application) return;
        try {
            setIsWithdrawing(true);
            await internshipsApi.withdrawApplication(application.internshipId);
            setIsWithdrawModalOpen(false);
            navigate('/dashboard/student/applications');
        } catch (err) {
            console.error('Failed to withdraw', err);
            setError('Failed to withdraw application. Please try again.');
            setIsWithdrawModalOpen(false);
        } finally {
            setIsWithdrawing(false);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));

        if (diffInDays === 0) return 'Applied today';
        if (diffInDays === 1) return 'Applied 1 day ago';
        return `Applied ${diffInDays} days ago`;
    };

    return {
        application,
        loading,
        error,
        isWithdrawModalOpen,
        isWithdrawing,
        setIsWithdrawModalOpen,
        handleWithdrawConfirm,
        getTimeAgo,
        refetch: fetchApplication
    };
};
