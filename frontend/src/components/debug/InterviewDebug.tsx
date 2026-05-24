import { useMyInterviews } from '@/hooks/interviews/useMyInterviews';

export const InterviewDebug = () => {
    const { interviews, isLoading, error, refetch } = useMyInterviews();

    if (isLoading) return <div>Loading interviews...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
            <h2>Interview Hook Debug</h2>
            <button onClick={() => refetch()} style={{ marginBottom: '10px' }}>
                Refetch
            </button>
            <pre>
                {JSON.stringify(interviews, null, 2)}
            </pre>
        </div>
    );
};
