import React from 'react';
import { getPlatformFromUrl } from '@/utils/platformUtils';
import type { Interview } from '@/api/interviews.api';
import { useNavigate } from 'react-router-dom';

interface InterviewCardProps {
    interview: Interview;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({ interview }) => {
    const navigate = useNavigate();

    const internshipTitle = interview.internshipTitle || interview.application?.internship?.title || 'Unknown Role';
    const companyName = interview.companyName || interview.application?.internship?.company?.name || 'Unknown Company';

    const dateObj = new Date(interview.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    const getStatusBadge = (status: string) => {
        let styles = "bg-slate-100 text-slate-700";
        switch (status.toUpperCase()) {
            case 'SCHEDULED':
                styles = "bg-blue-50 text-blue-700 border border-blue-100";
                break;
            case 'COMPLETED':
                styles = "bg-emerald-50 text-emerald-700 border border-emerald-100";
                break;
            case 'CANCELLED':
                styles = "bg-red-50 text-red-700 border border-red-100";
                break;
            case 'PENDING':
                styles = "bg-amber-50 text-amber-700 border border-amber-100";
                break;
        }

        return (
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${styles}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
                <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">{internshipTitle}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">{companyName}</p>
                </div>
                <div className="shrink-0 ml-2">
                    {getStatusBadge(interview.status)}
                </div>
            </div>

            <div className="h-px bg-slate-50 w-full mb-5"></div>

            {/* Details */}
            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                        <span className="material-symbols-outlined text-[20px]">videocam</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Type</p>
                        <p className="text-sm text-slate-700 font-semibold capitalize">{interview.mode.toLowerCase().replace('_', ' ')} Interview</p>
                    </div>
                </div>

                <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                        <span className="material-symbols-outlined text-[20px]">event</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date & Time</p>
                        <p className="text-sm text-slate-700 font-semibold">{dateStr}, {timeStr}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                        <span className="material-symbols-outlined text-[20px]">laptop_mac</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Platform</p>
                        <p className="text-sm text-slate-700 font-semibold">{getPlatformFromUrl(interview.link, 'Virtual')}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
                {interview.link ? (
                    <a
                        href={interview.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-sm font-semibold shadow-md shadow-indigo-100 hover:shadow-lg active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[19px]">videocam</span>
                        Join Now
                    </a>
                ) : (
                    <button
                        disabled
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed text-sm font-semibold"
                    >
                        Join Now
                    </button>
                )}

                <button
                    onClick={() => navigate(`/dashboard/student/interviews/${interview.id}`)}
                    className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-full hover:bg-slate-50 transition-colors text-sm font-semibold"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};
