import React from 'react';
import { useEmptyStateActions } from '@/hooks/dashboard/student/useEmptyStateActions';
import { EmptyStateDashboardVisuals } from './EmptyStateDashboardVisuals';

const EmptyStateDashboard: React.FC = () => {
    const { navigateToProfile } = useEmptyStateActions();

    return (
        <EmptyStateDashboardVisuals
            onCompleteProfile={navigateToProfile}
        />
    );
};

export default EmptyStateDashboard;
