import { useState, useEffect } from 'react';
import { internshipsApi, type Application } from '@/api/internships.api';

export const useRecruiterApplication = (id: string | undefined) => {
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [savingRemarks, setSavingRemarks] = useState(false);

    useEffect(() => {
        const fetchApplication = async () => {
            if (!id) return;
            try {
                const response = await internshipsApi.getRecruiterApplicationById(id);
                const appData = response.data.data;
                setApplication(appData);
                setRemarks(appData.remarks || '');
            } catch (err: any) {
                console.error('Failed to fetch application:', err);
                setError(err.message || 'Failed to fetch application details');
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

    const handleStatusUpdate = async (newStatus: string) => {
        if (!application) return;
        setUpdating(true);
        try {
            await internshipsApi.updateApplicationStatus(application.id, {
                status: newStatus,
                remarks: remarks
            });
            setApplication(prev => prev ? { ...prev, status: newStatus as any } : null);
        } catch (err: any) {
            alert('Failed to update status: ' + err.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleRemarksSave = async () => {
        if (!application) return;
        setSavingRemarks(true);
        try {
            await internshipsApi.updateApplicationRemarks(application.id, remarks);
            setApplication(prev => prev ? { ...prev, remarks: remarks } : null);
        } catch (err: any) {
            alert('Failed to save remarks: ' + err.message);
        } finally {
            setSavingRemarks(false);
        }
    };

    const handleRemarksChange = (value: string) => {
        setRemarks(value);
    };

    return {
        application,
        loading,
        error,
        updating,
        remarks,
        savingRemarks,
        handleStatusUpdate,
        handleRemarksSave,
        handleRemarksChange,
    };
};
