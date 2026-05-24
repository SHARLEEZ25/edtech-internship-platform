// Component: HiringStats
// Purpose: Component to display and edit key hiring statistics. Shows metric pills or edit form.
import React from 'react';

interface HiringStatsProps {
    stats: {
        studentsHired: number;
        activePostings: number;
        retentionRate: number;
        yearsOfExperience: number;
    };
    isEditing?: boolean;
    isSaving?: boolean;
    onSave?: (stats: Partial<HiringStatsProps['stats']>) => void;
    onEditTrigger?: () => void;
    onCancel?: () => void;
}

const HiringStats: React.FC<HiringStatsProps> = ({ stats, isEditing, isSaving, onSave, onEditTrigger, onCancel }) => {
    const [tempStats, setTempStats] = React.useState(stats);
    const yearsRef = React.useRef<HTMLInputElement>(null);

    // Sync temp state when stats change and we are not editing
    React.useEffect(() => {
        if (!isEditing) {
            setTempStats(stats);
        }
    }, [stats, isEditing]);

    const handleSave = () => {
        if (onSave) onSave(tempStats);
    };

    // LOGIC: Determines if stats are empty (default 0s).
    const isPlaceholder = stats.studentsHired === 0 && stats.yearsOfExperience === 0;

    React.useEffect(() => {
        if (isEditing && yearsRef.current && isPlaceholder) {
            setTimeout(() => yearsRef.current?.focus(), 100);
        }
    }, [isEditing, isPlaceholder]);

    return (
        <div className="profile-card hiring-stats-card focus-within:ring-2 focus-within:ring-blue-100 transition-shadow">
            <div className="info-section-header" style={{ marginBottom: '1.5rem', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined icon-blue">analytics</span>
                    <h3>Hiring Experience</h3>
                </div>
                {!isEditing && (
                    <button className="section-edit-trigger" onClick={onEditTrigger} title="Edit stats">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </button>
                )}
                {isEditing && (
                    <div className="flex gap-2">
                        <button className="btn-save-inline" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Stats'}
                        </button>
                        <button className="btn-edit-profile" style={{ marginTop: 0, padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={onCancel} disabled={isSaving}>Cancel</button>
                    </div>
                )}
            </div>

            {isEditing ? (
                /* [VISUAL STATE]: Edit Mode. Grid of Number Inputs. */
                <div className="hiring-stats-edit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Years of Exp</label>
                        <input
                            ref={yearsRef}
                            type="number"
                            className="profile-input"
                            value={tempStats.yearsOfExperience}
                            onChange={(e) => setTempStats({ ...tempStats, yearsOfExperience: parseInt(e.target.value) || 0 })}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Students Hired</label>
                        <input
                            type="number"
                            className="profile-input"
                            value={tempStats.studentsHired}
                            onChange={(e) => setTempStats({ ...tempStats, studentsHired: parseInt(e.target.value) || 0 })}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Active Postings</label>
                        <input
                            type="number"
                            className="profile-input"
                            value={tempStats.activePostings}
                            onChange={(e) => setTempStats({ ...tempStats, activePostings: parseInt(e.target.value) || 0 })}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Retention %</label>
                        <input
                            type="number"
                            className="profile-input"
                            value={tempStats.retentionRate}
                            onChange={(e) => setTempStats({ ...tempStats, retentionRate: parseInt(e.target.value) || 0 })}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        />
                    </div>
                </div>
            ) : isPlaceholder ? (
                /* [VISUAL STATE]: First Time User / Empty State. Shown when key stats are 0. */
                <div className="empty-state-cta" onClick={onEditTrigger} style={{ padding: '1.5rem', borderStyle: 'dashed' }}>
                    <span className="material-symbols-outlined">analytics</span>
                    <p>Highlight your track record</p>
                    <span className="cta-subtitle">Show students your experience levels and hiring success rates.</span>
                    <button className="btn-add-brand">Add Stats</button>
                </div>
            ) : (
                /* [VISUAL STATE]: Repeated User / View Mode. Displays stats in pill format. */
                <div className="hiring-stats-container clickable-view" onClick={onEditTrigger} title="Click to edit">
                    <div className="stat-pill">
                        <span className="stat-value">{stats.yearsOfExperience}+</span>
                        <span className="stat-label">Years Exp</span>
                    </div>
                    <div className="stat-pill">
                        <span className="stat-value">{stats.studentsHired}+</span>
                        <span className="stat-label">Hired</span>
                    </div>
                    <div className="stat-pill">
                        <span className="stat-value">{stats.activePostings}</span>
                        <span className="stat-label">Active</span>
                    </div>
                    <div className="stat-pill">
                        <span className="stat-value">{stats.retentionRate}%</span>
                        <span className="stat-label">Retention</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HiringStats;
