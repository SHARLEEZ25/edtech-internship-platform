// Component: Headquarters
// Purpose: Displays the location details of the company headquarters. Supports setting valid city/state.
import React from 'react';

interface HeadquartersProps {
    address: string;
    city?: string;
    state?: string;
    mapImage?: string;
    isEditing?: boolean;
    isSaving?: boolean;
    onEditTrigger?: () => void;
    onCancel?: () => void;
    onSave?: (updates: { city: string; state: string }) => void;
}

const Headquarters: React.FC<HeadquartersProps> = ({ address, city = '', state = '', isEditing, isSaving, onEditTrigger, onCancel, onSave }) => {
    // LOGIC: Determines if the address is default placeholder or empty.
    const isPlaceholder = address === 'City, State' || !address;
    const [tempCity, setTempCity] = React.useState(city);
    const [tempState, setTempState] = React.useState(state);
    const cityRef = React.useRef<HTMLInputElement>(null);

    // Sync temp state when data changes and we are not editing
    React.useEffect(() => {
        if (!isEditing) {
            setTempCity(city);
            setTempState(state);
        }
    }, [city, state, isEditing]);

    const handleSave = () => {
        if (onSave) onSave({ city: tempCity, state: tempState });
    };

    React.useEffect(() => {
        if (isEditing && cityRef.current && isPlaceholder) {
            setTimeout(() => cityRef.current?.focus(), 100);
        }
    }, [isEditing, isPlaceholder]);

    return (
        <div className="profile-card focus-within:ring-2 focus-within:ring-blue-100 transition-shadow" style={{ overflow: 'hidden', padding: 0 }}>
            {/* Map Placeholder Graphic */}
            <div className="map-placeholder">
                <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.5 }}>map</span>
            </div>

            {/* Headquarters Details Section */}
            <div className="hq-details" style={{ padding: '1.25rem' }}>
                <div className="info-section-header" style={{ marginBottom: isEditing ? '0.75rem' : 0, justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined icon-blue">location_on</span>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Headquarters</h4>
                    </div>
                    {!isEditing && (
                        <button className="section-edit-trigger" onClick={onEditTrigger} title="Edit location">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                        </button>
                    )}
                    {isEditing && (
                        <div className="flex gap-2">
                            <button className="btn-save-inline" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save HQ'}
                            </button>
                            <button className="btn-edit-profile" style={{ marginTop: 0, padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={onCancel} disabled={isSaving}>Cancel</button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    /* [VISUAL STATE]: Edit Mode. Inputs for City and State. */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input
                            ref={cityRef}
                            className="profile-input"
                            placeholder="City (e.g. Bangalore)"
                            value={tempCity}
                            onChange={(e) => setTempCity(e.target.value)}
                            style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                            disabled={isSaving}
                        />
                        <input
                            className="profile-input"
                            placeholder="State (e.g. Karnataka)"
                            value={tempState}
                            onChange={(e) => setTempState(e.target.value)}
                            style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                            disabled={isSaving}
                        />
                    </div>
                ) : isPlaceholder ? (
                    /* [VISUAL STATE]: First Time User / Empty State. Shown when address is default/empty. */
                    <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Where do you operate from?</p>
                        <button
                            className="btn-add-brand"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', alignSelf: 'flex-start' }}
                            onClick={onEditTrigger}
                        >
                            Set Location
                        </button>
                    </div>
                ) : (
                    /* [VISUAL STATE]: Repeated User / View Mode. Displays address text. */
                    <div className="clickable-view" onClick={onEditTrigger} title="Click to edit">
                        <p style={{ marginTop: '0.4rem', color: '#1e293b' }}>{address}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Headquarters;
