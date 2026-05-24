// Header section for the internship details view.
import '../../../styles/internships/recruiter/internship-header.css';

interface InternshipHeaderVisualsProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: string;
    onStatusFilterChange: (status: string) => void;
    onAddClick: () => void;
}

export const InternshipHeaderVisuals: React.FC<InternshipHeaderVisualsProps> = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    onAddClick
}) => {
    return (
        <div className="internship-header-premium">
            <div className="header-main-row">
                <div className="header-info">
                    <h1 className="header-title">My Internships</h1>
                    <p className="header-subtitle">Manage and track your internship postings</p>
                </div>
                <button className="btn-add-internship" onClick={onAddClick}>
                    <span className="material-symbols-outlined">add</span>
                    Add Internship
                </button>
            </div>

            <div className="header-search-bar">
                <div className="search-input-pill">
                    <span className="material-symbols-outlined search-icon-mini">search</span>
                    <input
                        type="text"
                        className="search-input-field"
                        placeholder="Search internships by title or skills..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="status-filter-dropdown">
                    <span className="material-symbols-outlined filter-icon">tune</span>
                    <select
                        className="status-select"
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value)}
                    >
                        <option value="ALL">Status: All</option>
                        <option value="LIVE">Status: Open</option>
                        <option value="DRAFT">Status: Draft</option>
                        <option value="CLOSED">Status: Closed</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
