// Sidebar containing filters for searching internships.
import React from 'react';
import { type InternshipFilters } from '@/api/internships.api';

interface FiltersSidebarProps {
    filters: InternshipFilters;
    onFilterChange: (newFilters: Partial<InternshipFilters>) => void;
    onClear: () => void;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({ filters, onFilterChange, onClear }) => {
    const domains = ['Tech', 'Marketing', 'Design'];
    const locations = ['Bangalore', 'Mumbai', 'Hyderabad'];
    const types = ['Remote', 'On-site', 'Hybrid'];

    const handleCheckboxChange = (category: keyof InternshipFilters, value: string) => {
        const internalValue = value === 'On-site' ? 'ONSITE' : value.toUpperCase();
        if (filters[category] === internalValue) {
            onFilterChange({ [category]: undefined });
        } else {
            onFilterChange({ [category]: internalValue });
        }
    };

    const handleDomainChange = (domain: string) => {
        if (filters.domain === domain) {
            onFilterChange({ domain: undefined });
        } else {
            onFilterChange({ domain });
        }
    };

    return (
        <aside className="filters-sidebar">
            <div className="filters-header">
                <h3 className="filters-title">Filters</h3>
                <button className="clear-btn" onClick={onClear}>Clear all</button>
            </div>

            <div className="filter-section">
                <span className="filter-section-title">Domain</span>
                <div className="filter-options">
                    {domains.map(domain => {
                        let badgeClass = 'badge-blue';
                        if (domain === 'Design') badgeClass = 'badge-purple';
                        if (domain === 'Marketing') badgeClass = 'badge-yellow';

                        return (
                            <label key={domain} className="filter-checkbox-label">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                                    <input
                                        type="checkbox"
                                        className="filter-checkbox"
                                        checked={filters.domain === domain}
                                        onChange={() => handleDomainChange(domain)}
                                    />
                                    <span>{domain}</span>
                                </div>
                                <span className={`badge ${badgeClass}`} style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem' }}>{domain}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            <div className="filter-section">
                <span className="filter-section-title">Location</span>
                <div className="filter-options">
                    {locations.map(loc => (
                        <label key={loc} className="filter-checkbox-label">
                            <input
                                type="checkbox"
                                className="filter-checkbox"
                                checked={filters.location === loc}
                                onChange={() => onFilterChange({ location: filters.location === loc ? undefined : loc })}
                            />
                            {loc}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <span className="filter-section-title">Stipend (₹/month)</span>
                <div style={{ padding: '0 0.5rem' }}>
                    <input
                        type="range"
                        min="0"
                        max="50000"
                        step="5000"
                        value={filters.minStipend || 0}
                        onChange={(e) => onFilterChange({ minStipend: parseInt(e.target.value) })}
                        style={{ width: '100%', accentColor: '#4A85F6' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                        <span>₹0</span>
                        <span>₹50k+</span>
                    </div>
                </div>
            </div>

            <div className="filter-section">
                <span className="filter-section-title">Remote/On-site</span>
                <div className="filter-options">
                    {types.map(type => {
                        const internalValue = type === 'On-site' ? 'ONSITE' : type.toUpperCase();
                        return (
                            <label key={type} className="filter-checkbox-label">
                                <input
                                    type="checkbox"
                                    className="filter-checkbox"
                                    checked={filters.type === internalValue}
                                    onChange={() => handleCheckboxChange('type', type)}
                                />
                                {type}
                            </label>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};
