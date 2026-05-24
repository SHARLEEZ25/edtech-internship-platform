import { useNavigate } from 'react-router-dom';

export const useEmptyStateActions = () => {
    const navigate = useNavigate();
    return {
        navigateToProfile: () => navigate('/dashboard/student/profile'),
    };
};
