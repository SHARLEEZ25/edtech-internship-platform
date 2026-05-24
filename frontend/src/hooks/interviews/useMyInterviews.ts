import { useState, useEffect, useCallback } from 'react';
import { interviewsApi, type Interview } from '@/api/interviews.api';

interface UseMyInterviewsReturn {
    interviews: Interview[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useMyInterviews = (): UseMyInterviewsReturn => {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInterviews = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await interviewsApi.getMyInterviews();
            // Based on user confirmation, response.data.data is the array
            setInterviews(response.data.data);
        } catch (err: any) {
            console.error('Error fetching interviews:', err);
            setError(err.response?.data?.message || 'Failed to fetch interviews');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInterviews();
    }, [fetchInterviews]);

    return {
        interviews,
        isLoading,
        error,
        refetch: fetchInterviews
    };
};
