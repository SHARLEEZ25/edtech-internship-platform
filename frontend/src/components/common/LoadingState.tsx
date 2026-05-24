import React from 'react';

interface LoadingStateProps {
    message?: string;
    size?: 'small' | 'medium' | 'large';
    fullPage?: boolean;
}

/**
 * Reusable loading state component with a premium spinner.
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
    message,
    size = 'large',
    fullPage = false
}) => {
    const sizeMap = {
        small: { container: '20vh', loader: '32px' },
        medium: { container: '40vh', loader: '48px' },
        large: { container: '60vh', loader: '64px' }
    };

    const containerStyle: React.CSSProperties = fullPage ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f7f7f7',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem'
    } : {
        minHeight: sizeMap[size].container,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '2rem'
    };

    return (
        <div style={containerStyle}>
            <div
                className="premium-loader"
                style={{
                    width: sizeMap[size].loader,
                    height: sizeMap[size].loader,
                    borderWidth: '4px'
                }}
            ></div>
            {message && <span style={{ color: '#64748b', fontWeight: '600', fontSize: '1rem' }}>{message}</span>}
        </div>
    );
};
