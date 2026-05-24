import { useState } from 'react';
import { interviewsApi, type ScheduleInterviewPayload } from '@/api/interviews.api';

interface UseInterviewActionsReturn {
    scheduleInterview: (payload: ScheduleInterviewPayload) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export const useInterviewActions = (): UseInterviewActionsReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scheduleInterview = async (payload: ScheduleInterviewPayload) => {
        setIsLoading(true);
        setError(null);
        try {
            await interviewsApi.scheduleInterview(payload);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to schedule interview';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        scheduleInterview,
        isLoading,
        error
    };
};
