// Component: EngagementsList
// Purpose: Showcases events and engagements hosted by the company. Allows adding/removing events.
import React, { useState } from 'react';

interface Engagement {
    id: string;
    title: string;
    subtitle: string;
    status: 'UPCOMING' | 'COMPLETED';
    icon: string;
}

interface EngagementsListProps {
    engagements: Engagement[];
    isEditing?: boolean;
    onAdd?: (eng: Omit<Engagement, 'id'>) => void;
    onDelete?: (id: string) => void;
    onEditTrigger?: () => void;
    onCancel?: () => void;
}

const EngagementsList: React.FC<EngagementsListProps> = ({ engagements, isEditing, onAdd, onDelete, onEditTrigger, onCancel }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newSubtitle, setNewSubtitle] = useState('');
    const [newStatus, setNewStatus] = useState<'UPCOMING' | 'COMPLETED'>('UPCOMING');
    const firstInputRef = React.useRef<HTMLInputElement>(null);

    const handleAdd = () => {
        if (newTitle.trim() && onAdd) {
            onAdd({
                title: newTitle.trim(),
                subtitle: newSubtitle.trim() || 'Details...',
                status: newStatus,
                icon: 'campaign'
            });
            setNewTitle('');
            setNewSubtitle('');
            setShowAddForm(false);
        }
    };

    const handleCTAClick = () => {
        setShowAddForm(true);
        if (onEditTrigger) onEditTrigger();
    };

    React.useEffect(() => {
        if (showAddForm && firstInputRef.current) {
            setTimeout(() => firstInputRef.current?.focus(), 100);
        }
    }, [showAddForm]);

    // LOGIC: Check for existing data.
    const hasEngagements = engagements.length > 0;

    return (
        <div className="profile-card engagements-card focus-within:ring-2 focus-within:ring-blue-100 transition-shadow">
            {/* Header Section */}
            <div className="info-section-header" style={{ marginBottom: '1.5rem', justifyContent: 'space-between' }}>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined icon-blue">campaign</span>
                    <h3>Engagements</h3>
                </div>
                {!isEditing && (
                    <button className="section-edit-trigger" onClick={onEditTrigger} title="Edit engagements">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </button>
                )}
                {isEditing && (
                    <div className="flex gap-2">
                        <button
                            className="btn-save-inline"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => setShowAddForm(true)}
                        >
                            + Add New
                        </button>
                        <button className="btn-edit-profile" style={{ marginTop: 0, padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={onCancel}>Done</button>
                    </div>
                )}
            </div>

            {/* [VISUAL STATE]: Add New Engagement Form. Active when user clicks (+Add New). */}
            {isEditing && showAddForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-fade-in flex flex-col gap-3">
                    <input
                        ref={firstInputRef}
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Engagement title (e.g. Tech Talk)"
                        className="profile-input"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    />
                    <input
                        type="text"
                        value={newSubtitle}
                        onChange={(e) => setNewSubtitle(e.target.value)}
                        placeholder="Location/Date (e.g. IIT Bangalore)"
                        className="profile-input"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    />
                    <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as any)}
                        className="profile-input"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    >
                        <option value="UPCOMING">Upcoming</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                    <div className="flex gap-2 mt-1">
                        <button className="btn-save-inline" onClick={handleAdd}>Add Engagement</button>
                        <button
                            className="btn-save-inline"
                            style={{ background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0' }}
                            onClick={() => setShowAddForm(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {!hasEngagements && !isEditing ? (
                /* [VISUAL STATE]: First Time User / Empty State. Shown when 'engagements' array is empty. */
                <div className="empty-state-cta" onClick={handleCTAClick}>
                    <span className="material-symbols-outlined">campaign</span>
                    <p>Share your brand story</p>
                    <span className="cta-subtitle">Post about your recent events, talks, or company culture updates to engage with students.</span>
                    <button className="btn-add-brand">Create First Post</button>
                </div>
            ) : (
                /* [VISUAL STATE]: Repeated User / View Mode. List of engagement cards. */
                <div className="engagements-list">
                    {engagements.map(item => (
                        <div key={item.id} className={`engagement-item ${isEditing ? 'edit-mode' : ''} group`}>
                            <div className="engagement-left">
                                <div className={`engagement-icon ${item.status === 'UPCOMING' ? 'orange' : 'blue'}`}>
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                </div>
                                <div className="engagement-info">
                                    <h4>{item.title}</h4>
                                    <p>{item.subtitle}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`status-badge ${item.status === 'UPCOMING' ? 'status-upcoming' : 'status-completed'}`}>
                                    {item.status}
                                </span>
                                {isEditing && (
                                    <button
                                        className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-[14px] hover:bg-red-200 transition-colors"
                                        onClick={() => onDelete && onDelete(item.id)}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EngagementsList;
