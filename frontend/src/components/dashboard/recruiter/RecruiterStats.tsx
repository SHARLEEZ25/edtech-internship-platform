import React from 'react';
import type { StatItem } from '@/hooks/dashboard/useRecruiterDashboardData';
import '../../../styles/dashboard/recruiter-dashboard.css';

interface RecruiterStatsProps {
    statItems: StatItem[];
}

const RecruiterStats: React.FC<RecruiterStatsProps> = ({ statItems }) => {
    return (
        <div className="stats-recruiter-grid">
            {statItems.map((stat, index) => (
                <div key={index} className={`recruiter-stat-card stat-card-${stat.cardType}`}>
                    <div className="stat-header">
                        <div className={`stat-icon-wrapper stat-icon-${stat.cardType === 'indigo' ? 'indigo' : stat.cardType}`}>
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                        {stat.trend && (
                            <span className={`stat-trend trend-${stat.trendType}`}>
                                {stat.trend}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="stat-label">{stat.label}</p>
                        <h3 className="stat-value">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecruiterStats;
