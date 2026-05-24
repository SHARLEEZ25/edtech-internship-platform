import { useState, useCallback } from 'react';
import { interviewsApi } from '@/api/interviews.api';
import type { Interview, ScheduleInterviewPayload } from '@/api/interviews.api';

export const useInterviews = () => {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInterviews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await interviewsApi.getMyInterviews();
            const data = response.data || response;
            setInterviews(Array.isArray(data) ? data : ((data as any).data || []));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch interviews');
            console.error('Fetch interviews error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const scheduleInterview = useCallback(async (payload: ScheduleInterviewPayload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await interviewsApi.scheduleInterview(payload);
            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to schedule interview';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const respondToInterview = useCallback(async (id: string, payload: { response: 'ACCEPT' | 'DECLINE' }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await interviewsApi.respondToInterview(id, payload);
            await fetchInterviews();
            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to respond to interview';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [fetchInterviews]);

    const completeInterview = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await interviewsApi.completeInterview(id);
            await fetchInterviews();
            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to complete interview';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [fetchInterviews]);

    const cancelInterview = useCallback(async (id: string, reason?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await interviewsApi.cancelInterview(id, { reason });
            await fetchInterviews();
            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to cancel interview';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [fetchInterviews]);

    const rescheduleInterview = useCallback(async (id: string, payload: { date: string; link?: string; notes?: string }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await interviewsApi.rescheduleInterview(id, payload);
            await fetchInterviews();
            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to reschedule interview';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [fetchInterviews]);

    const getInterviewById = useCallback(async (id: string) => {
        try {
            const response = await interviewsApi.getInterviewById(id);
            return (response.data || response) as unknown as Interview;
        } catch (err: any) {
            console.error('Get interview by id error:', err);
            return null;
        }
    }, []);

    return {
        interviews,
        loading,
        error,
        fetchInterviews,
        scheduleInterview,
        respondToInterview,
        completeInterview,
        cancelInterview,
        rescheduleInterview,
        getInterviewById
    };
};
