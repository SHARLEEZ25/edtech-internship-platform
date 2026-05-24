import { useState, useEffect } from 'react';
import { interviewsApi, type Interview } from '@/api/interviews.api';

interface UseInterviewResult {
    interview: Interview | null;
    isLoading: boolean;
    error: string | null;
}

export const useInterview = (id: string | undefined): UseInterviewResult => {
    const [interview, setInterview] = useState<Interview | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInterview = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const response = await interviewsApi.getInterviewById(id);
                // ApiResponse has { data: T, message?: string, error?: boolean }
                if (!response.data.error) {
                    setInterview(response.data.data);
                } else {
                    setError(response.data.message || 'Failed to fetch interview details');
                }
            } catch (err: any) {
                console.error('Error fetching interview:', err);
                setError(err.response?.data?.message || 'Failed to load interview details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterview();
    }, [id]);

    return { interview, isLoading, error };
};
