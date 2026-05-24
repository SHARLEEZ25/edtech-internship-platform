import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
    error: string;
    showBackButton?: boolean;
    onBackClick?: () => void;
    icon?: string;
}

/**
 * Reusable error state component with icon, message, and optional back button.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
    error,
    showBackButton = true,
    onBackClick,
    icon = 'warning'
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <span className={`material-symbols-outlined text-red-500 text-5xl`}>{icon}</span>
            <h2 className="text-xl font-bold">Error</h2>
            <p className="text-gray-600">{error}</p>
            {showBackButton && (
                <button
                    onClick={handleBack}
                    className="px-6 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-medium transition-colors"
                >
                    Go Back
                </button>
            )}
        </div>
    );
};
