// Main layout for searching and browsing available internships.
import React, { useState } from 'react';
import { InternshipCard } from './InternshipCard';
import { FiltersSidebar } from './FiltersSidebar';
import { type Internship, type InternshipFilters } from '@/api/internships.api';
import { LoadingState } from '@/components/common/LoadingState';

interface FindInternshipsVisualsProps {
    internships: Internship[];
    loading: boolean;
    isInitialLoading: boolean;
    error: string | null;
    filters: InternshipFilters;
    pagination: {
        total: number;
        page: number;
        totalPages: number;
    };
    onFilterChange: (newFilters: Partial<InternshipFilters>) => void;
    onPageChange: (page: number) => void;
    onSearch: (query: string) => void;
    onClearFilters: () => void;
}

export const FindInternshipsVisuals: React.FC<FindInternshipsVisualsProps> = ({
    internships,
    loading,
    isInitialLoading,
    error,
    filters,
    pagination,
    onFilterChange,
    onPageChange,
    onSearch,
    onClearFilters
}) => {
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Pagination Logic
    const renderPagination = () => {
        const { page, totalPages } = pagination;
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Complex pagination matching the mockup image (1 2 3 ... 10)
            if (page <= 2) {
                pages.push(1, 2, 3, '...', totalPages);
            } else if (page >= totalPages - 1) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', page, page + 1, '...', totalPages);
            }
        }

        return pages.map((p, index) => (
            p === '...' ? (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
            ) : (
                <button
                    key={p}
                    className={`page-btn ${pagination.page === p ? 'active' : ''}`}
                    onClick={() => onPageChange(p as number)}
                >
                    {p}
                </button>
            )
        ));
    };

    return (
        <div className="student-marketplace">
            {/* Background Loading Bar */}
            {loading && !isInitialLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(to right, #4A85F6, #9333ea)',
                    zIndex: 9999,
                    animation: 'loading-bar 2s infinite linear'
                }}></div>
            )}

            <div className="marketplace-container">
                <header className="marketplace-header">
                    <h1 className="marketplace-title">Find Internships</h1>
                    <p className="marketplace-subtitle">Explore opportunities based on your skills and interests</p>
                </header>

                <div className="marketplace-search-row">
                    <div className="marketplace-search-container">
                        <span className="material-symbols-outlined search-icon">search</span>
                        <input
                            type="text"
                            className="marketplace-search-input"
                            placeholder="Search by title, company"
                            value={filters.search || ''}
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                    <button
                        className="mobile-filter-toggle"
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                    >
                        <span className="material-symbols-outlined">filter_list</span>
                        Filters
                    </button>
                </div>

                <div className="marketplace-content">
                    {/* [VISUAL STATE]: Sidebar. Filters for internships. */}
                    <div className={`filters-wrapper ${showMobileFilters ? 'show-mobile' : ''}`}>
                        <FiltersSidebar
                            filters={filters}
                            onFilterChange={onFilterChange}
                            onClear={onClearFilters}
                        />
                    </div>

                    <main style={{
                        position: 'relative',
                        opacity: loading && !isInitialLoading ? 0.7 : 1,
                        transition: 'opacity 0.2s ease',
                        pointerEvents: loading && !isInitialLoading ? 'none' : 'auto'
                    }}>
                        {isInitialLoading ? (
                            <LoadingState size="medium" />
                        ) : error ? (
                            <div className="empty-container">
                                <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#ef4444' }}>error</span>
                                <h3 style={{ marginTop: '1rem' }}>Something went wrong</h3>
                                <p style={{ color: '#64748b' }}>{error}</p>
                            </div>
                        ) : internships.length === 0 ? (
                            /* [VISUAL STATE]: Empty State. Shown when no internships match filters. */
                            <div className="empty-container">
                                <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#94a3b8' }}>sentiment_dissatisfied</span>
                                <h3 style={{ marginTop: '1rem' }}>No internships found</h3>
                                <p style={{ color: '#64748b' }}>Try adjusting your filters or search query.</p>
                                <button className="clear-btn" style={{ marginTop: '1rem', textDecoration: 'underline' }} onClick={onClearFilters}>
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* [VISUAL STATE]: List View. Grid of internships. */}
                                <div className="internships-grid">
                                    {internships.map(internship => (
                                        <InternshipCard key={internship.id} internship={internship} />
                                    ))}
                                </div>

                                {pagination.totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="page-btn"
                                            disabled={pagination.page <= 1}
                                            onClick={() => pagination.page > 1 && onPageChange(pagination.page - 1)}
                                        >
                                            <span className="material-symbols-outlined">chevron_left</span>
                                        </button>

                                        {renderPagination()}

                                        <button
                                            className="page-btn"
                                            disabled={pagination.page >= pagination.totalPages}
                                            onClick={() => pagination.page < pagination.totalPages && onPageChange(pagination.page + 1)}
                                        >
                                            <span className="material-symbols-outlined">chevron_right</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            <style>{`
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};
