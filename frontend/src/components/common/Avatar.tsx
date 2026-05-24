import React, { useState } from 'react';
import './Avatar.css';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    name: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const COLORS = [
    '#EF4444', // Red 500
    '#F97316', // Orange 500
    '#F59E0B', // Amber 500
    '#10B981', // Emerald 500
    '#06B6D4', // Cyan 500
    '#3B82F6', // Blue 500
    '#6366F1', // Indigo 500
    '#8B5CF6', // Violet 500
    '#EC4899', // Pink 500
    '#F43F5E', // Rose 500
];

const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
};

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    name,
    size = 'md',
    className = ''
}) => {
    const [imgError, setImgError] = useState(false);

    const initials = getInitials(name);
    const backgroundColor = getColorFromName(name);

    return (
        <div
            className={`avatar-container avatar-${size} ${className}`}
            style={{ backgroundColor: !src || imgError ? backgroundColor : 'transparent' }}
            title={name}
        >
            {src && !imgError ? (
                <img
                    src={src}
                    alt={alt || name}
                    className="avatar-image"
                    onError={() => setImgError(true)}
                />
            ) : (
                <span className="avatar-initials">{initials}</span>
            )}
        </div>
    );
};
