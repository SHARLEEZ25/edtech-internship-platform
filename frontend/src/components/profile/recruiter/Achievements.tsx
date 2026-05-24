// Component: Achievements
// Purpose: Section to list company awards, recognitions, and milestones. Supports adding new ones.
import React, { useState } from 'react';

interface Achievement {
    id: string;
    label: string;
    icon: string;
    colorClass: string;
}

interface AchievementsProps {
    achievements: Achievement[];
    isEditing?: boolean;
    onAdd?: (ach: Omit<Achievement, 'id'>) => void;
    onDelete?: (id: string) => void;
    onEditTrigger?: () => void;
    onCancel?: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ achievements, isEditing, onAdd, onDelete, onEditTrigger, onCancel }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newLabel, setNewLabel] = useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleAdd = () => {
        if (newLabel.trim() && onAdd) {
            onAdd({
                label: newLabel.trim(),
                icon: 'military_tech', // Default icon
                colorClass: 'badge-gold' // Default to gold
            });
            setNewLabel('');
            setShowAddForm(false);
        }
    };

    const handleCTAClick = () => {
        setShowAddForm(true);
        if (onEditTrigger) onEditTrigger();
    };

    React.useEffect(() => {
        if (showAddForm && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [showAddForm]);

    // LOGIC: Check if data exists determines which UI state to show.
    const hasAchievements = achievements.length > 0;

    return (
        <div className="profile-card focus-within:ring-2 focus-within:ring-blue-100 transition-shadow">
            {/* Section Header */}
            <div className="info-section-header" style={{ marginBottom: '1.5rem', justifyContent: 'space-between' }}>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined icon-blue">military_tech</span>
                    <h3>Achievements</h3>
                </div>
                {!isEditing && (
                    <button className="section-edit-trigger" onClick={onEditTrigger} title="Edit achievements">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </button>
                )}
                {isEditing && (
                    <button className="btn-edit-profile" style={{ marginTop: 0, padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={onCancel}>Done</button>
                )}
            </div>

            {!hasAchievements && !isEditing ? (
                /* [VISUAL STATE]: First Time User / Empty State. Shown when 'achievements' array is empty. */
                <div className="empty-state-cta" onClick={handleCTAClick}>
                    <span className="material-symbols-outlined">military_tech</span>
                    <p>Showcase your milestones</p>
                    <span className="cta-subtitle">Add awards, recognitions, or company milestones to build trust with students.</span>
                    <button className="btn-add-brand">+ Add Achievement</button>
                </div>
            ) : (
                /* [VISUAL STATE]: Repeated User / View Mode. Shown when 'achievements' exist. */
                <div className="achievements-row">
                    {achievements.map((ach) => (
                        <div key={ach.id} className="achievement-badge relative group">
                            <div
                                className={`badge-circle ${ach.colorClass}`}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '28px'
                                }}
                            >
                                {/* Use emoji icon directly */}
                                {ach.icon}
                            </div>
                            <span className="badge-label" style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#475569',
                                textAlign: 'center',
                                marginTop: '8px'
                            }}>{ach.label}</span>
                            {/* Delete Button (Edit Mode) */}
                            {isEditing && (
                                <button
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => onDelete && onDelete(ach.id)}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Editing Controls - Overlay/Collapsible Area */}
            {isEditing && (
                <div className="mt-6">
                    {showAddForm ? (
                        /* [VISUAL STATE]: Add New Form. Active when clicking 'Add Achievement'. */
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 animate-fade-in">
                            <input
                                ref={inputRef}
                                type="text"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                placeholder="e.g. Top Hirer 2024"
                                className="profile-input mb-3"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            />
                            <div className="flex gap-2">
                                <button className="btn-save-inline" onClick={handleAdd}>Save Achievement</button>
                                <button
                                    className="btn-save-inline"
                                    style={{ background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0' }}
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* [VISUAL STATE]: Edit Mode Action Button. */
                        <button className="btn-add-achievement" onClick={() => setShowAddForm(true)}>
                            <span className="material-symbols-outlined">add_circle</span>
                            ADD ACHIEVEMENT
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Achievements;
